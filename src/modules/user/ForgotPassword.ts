import { Resolver, Mutation, Arg } from "type-graphql";
import { v4 } from "uuid";
import { redis } from "../../redis";
import { User } from "../../entity/User";
import { sendEmail } from "../../utils/sendMail";
import { FORGOT_PASSWORD_PREFIX } from "../constants/redisPrefixes";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      60 * 60 * 24
    ); // one day

    await sendEmail(
      email,
      `http://localhost:3000/user/change-password/${token}`
    );

    return true;
  }
}
