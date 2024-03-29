import nodemailer, { Transporter } from 'nodemailer';
import handleBars from 'handlebars';
import fs from 'fs';

class SendMailService {
    private client: Transporter;

    constructor(){
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                },
            });

            this.client = transporter;   
        })
    }
    
    async execute (to: string, subject: string, variables: object, path: string){
        
        const templateFileContent = fs.readFileSync(path).toString("utf8");

        const mailTemplateParse = handleBars.compile(templateFileContent);
        const html = mailTemplateParse(variables);

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreplay@npd.com.br>"
        });

        console.log(`message id: ${message.messageId} URL: ${nodemailer.getTestMessageUrl(message)}`);
    }
}

export default new SendMailService();