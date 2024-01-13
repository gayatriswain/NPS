import { EntityRepository, Repository } from "typeorm";
import { ServeyUser } from "../models/SurveyUser";

@EntityRepository(ServeyUser)
class SurveysUsersRepository extends Repository<ServeyUser> {}

export { SurveysUsersRepository }