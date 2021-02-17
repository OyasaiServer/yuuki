import {
    Discord,
    On,
    Client,
    ArgsOf
} from "@typeit/discord";

@Discord()
export abstract class Yuuki {

    @On("message")
    private onMessage(
        [message]: ArgsOf<"message">,
        client: Client,
    ) {
        console.log(
        )
    }

}