import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerContoller {
    async execute (request: Request, response: Response){
        const { value } = request.params;
        const { u } = request.query;

        const surveysUserRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUserRepository.findOne({
            id: String(u)
        });

        if(!surveyUser){
            throw new AppError("Survey user does not exists!");
        }

        surveyUser.value = Number(value);

        await surveysUserRepository.save(surveyUser);

        return response.json(surveyUser);
    }
}

export { AnswerContoller }