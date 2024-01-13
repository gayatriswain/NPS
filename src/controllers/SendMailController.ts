import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { resolve } from 'path';
import SendEmailService from "../services/SendMailService";
import { AppError } from "../errors/AppError";


class SendMailController {
    async execute (request: Request, response: Response){
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveyRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({ email });
        if(!user){
            return response.status(400).json({
                error: "User does not exists",
            });
        }

        const survey = await surveyRepository.findOne({ id: survey_id });
        if(!survey){
            throw new AppError("Survey does not exists!");
        }
        
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlredyExist = await surveysUsersRepository.findOne({
            where: [{user_id: user.id, value: null}],
            relations: ["user", "survey"]
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if(surveyUserAlredyExist){
            variables.id = surveyUserAlredyExist.id;
            await SendEmailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlredyExist);
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id: survey_id
        }) 
        await surveysUsersRepository.save(surveyUser);

        variables.id = surveyUser.id;

        await SendEmailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser)
    }
}

export { SendMailController }