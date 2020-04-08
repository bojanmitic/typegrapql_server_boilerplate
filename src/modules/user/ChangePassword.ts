import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { redis } from "../../redis";
import { User } from "../../entity/User";
import { FORGOT_PASSWORD_PREFIX } from "../constants/redisPrefixes";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import bcrypt from "bcryptjs";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token);

    if (!userId) {
      return null;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    await redis.del(FORGOT_PASSWORD_PREFIX + token);

    ctx.req.session!.userId = user.id;

    return user;
  }
}
