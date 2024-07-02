import {runCommand} from "../helpers";
import {JSONSerializer} from "../../../lib/serializers/json";
import {CBORSerializer} from "../../../lib/serializers/cbor";
import {MsgPackSerializer} from "../../../lib/serializers/msgpack";
import {Subscribed, SubscribedFields} from "../../../lib/messages/subscribed";

function isEqual(msg1: Subscribed, msg2: any): boolean {
    return (
        msg1.requestID === msg2.requestID &&
        msg1.subscriptionID === msg2.subscriptionID
    );
}

describe('Message Serializer', function () {

    it('JSON Serializer', async function () {
        const subscribed = new Subscribed(new SubscribedFields(1, 5));
        const command = `wampproto message subscribed ${subscribed.requestID} ${subscribed.subscriptionID} --serializer json`;

        const output = await runCommand(command);

        const serializer = new JSONSerializer();
        const message = serializer.deserialize(output);

        expect(isEqual(subscribed, message)).toBeTruthy();
    });

    it('CBOR Serializer', async function () {
        const subscribed = new Subscribed(new SubscribedFields(1, 3));
        const command = `wampproto message subscribed ${subscribed.requestID} ${subscribed.subscriptionID} --serializer cbor --output hex`;

        const output = await runCommand(command);
        const outputBytes = Buffer.from(output, 'hex');

        const serializer = new CBORSerializer();
        const message = serializer.deserialize(outputBytes);

        expect(isEqual(subscribed, message)).toBeTruthy();
    });

    it('MsgPack Serializer', async function () {
        const subscribed = new Subscribed(new SubscribedFields(1, 3));
        const command = `wampproto message subscribed ${subscribed.requestID} ${subscribed.subscriptionID} --serializer msgpack --output hex`;

        const output = await runCommand(command);
        const outputBytes = Buffer.from(output, 'hex');

        const serializer = new MsgPackSerializer();
        const message = serializer.deserialize(outputBytes);

        expect(isEqual(subscribed, message)).toBeTruthy();
    });
});
