import { InputType, Field } from "type-graphql";
import { PasswordInput } from "../../shared/passwordInput";

@InputType()
export class ChangePasswordInput extends PasswordInput {
  @Field()
  token: string;
}
