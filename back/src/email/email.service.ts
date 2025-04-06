import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { getVerificationEmailTemplate } from '@email/confirmation.email'

@Injectable()
export class EmailService {
	constructor(private readonly mailerService: MailerService) {}

	sendEmail(to: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to,
			subject,
			html
		})
	}
	async sendVerification(to: string, verificationLink: string) {
		const html = getVerificationEmailTemplate(verificationLink)
		return this.sendEmail(to, 'Подтверждение почты', html)
	}
}
