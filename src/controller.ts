import { Request, Response } from "express";
import { activityService } from "./service";

const activityController = async (req: Request, res: Response): Promise<Express.Response> => {

    try {
        const { body: { email, phoneNumber } } = req;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email) || isNaN(Number(phoneNumber))) {
            throw new Error('Wrong Email or PhoneNumber');
        }

        if (!email && !phoneNumber) {
            throw new Error('Wrong Data Given.');
        }

        //check for email through regex and phon
        const result = await activityService({ email, phoneNumber });

        return res.status(200).json({ result });
    } catch (e) {
        console.error(`${e}`);
        return res.status(200).json({ ok: false, msg: 'Something Went Wrong!', err: e });
    }

}

export { activityController };