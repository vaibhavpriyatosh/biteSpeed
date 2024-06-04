import { Request, Response } from "express";
import { activityService } from "./service";

const activityController = async (req: Request, res: Response): Promise<Express.Response> => {

    try {
        let { body: { email, phoneNumber } } = req;


        if (!email && !phoneNumber) {
            throw new Error('Wrong Data Given.');
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailPattern.test(email)) {
            throw new Error('Wrong Email');
        } if (phoneNumber && isNaN(Number(phoneNumber))) {
            throw new Error('Wrong PhoneNumber');
        }

        const result = await activityService({ email, phoneNumber });

        return res.status(200).json({ result });
    } catch (e) {
        console.error(`${e}`);
        return res.status(200).json({ ok: false, msg: 'Something Went Wrong!', err: e });
    }

}

export { activityController };