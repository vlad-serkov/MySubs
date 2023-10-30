package com.example.demo.registration;

import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserRole;
import com.example.demo.appuser.AppUserService;
import com.example.demo.email.EmailSender;
import com.example.demo.registration.token.ConfirmationToken;
import com.example.demo.registration.token.ConfirmationTokenService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class RegistrationService {

    private final AppUserService appUserService;
    private final EmailValidator emailValidator;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailSender emailSender;

    public String register(RegistrationRequest request) {
        boolean isValidEmail = emailValidator.
                test(request.getEmail());

        if (!isValidEmail) {
            throw new IllegalStateException("email not valid");
        }

        String token = appUserService.signUpUser(
                new AppUser(
                        request.getFirstName(),
                        request.getLastName(),
                        request.getEmail(),
                        request.getPassword(),
                        AppUserRole.USER

                )
        );

        String link = "http://localhost:8080/api/v1/registration/confirm?token=" + token;
        emailSender.send(
                request.getEmail(),
                buildEmail(request.getFirstName(), link));

        return token;
    }

    @Transactional
    public String confirmToken(String token) {
        ConfirmationToken confirmationToken = confirmationTokenService
                .getToken(token)
                .orElseThrow(() ->
                        new IllegalStateException("token not found"));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new IllegalStateException("email already confirmed");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("token expired");
        }

        confirmationTokenService.setConfirmedAt(token);
        appUserService.enableAppUser(
                confirmationToken.getAppUser().getEmail());
        return "confirmed";
    }

    private String buildEmail(String name, String link) {
        return "<div style=\"font-family: Helvetica, Arial, sans-serif; font-size: 16px; margin: 0; color: #0b0c0c\">\n" +
                "    <span style=\"display: none; font-size: 1px; color: #fff; max-height: 0\"></span>\n" +
                "    <table role=\"presentation\" width=\"100%\" style=\"border-collapse: collapse; min-width: 100%; width: 100% !important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "        <tbody>\n" +
                "            <tr>\n" +
                "                <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "                    <table role=\"presentation\" width=\"100%\" style=\"border-collapse: collapse; max-width: 580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "                        <tbody>\n" +
                "                            <tr>\n" +
                "                                <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                                    <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse: collapse\">\n" +
                "                                        <tbody>\n" +
                "                                            <tr>\n" +
                "                                                <td style=\"padding-left: 10px\"></td>\n" +
                "                                                <td style=\"font-size: 28px; line-height: 1.315789474; margin-top: 4px; padding-left: 10px\">\n" +
                "                                                    <span style=\"font-family: Helvetica, Arial, sans-serif; font-weight: 700; color: #ffffff; text-decoration: none; vertical-align: top; display: inline-block\">Подтверди свою почту</span>\n" +
                "                                                </td>\n" +
                "                                            </tr>\n" +
                "                                        </tbody>\n" +
                "                                    </table>\n" +
                "                                </td>\n" +
                "                            </tr>\n" +
                "                        </tbody>\n" +
                "                    </table>\n" +
                "                </td>\n" +
                "            </tr>\n" +
                "        </tbody>\n" +
                "    </table>\n" +
                "    <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse: collapse; max-width: 580px; width: 100% !important\" width=\"100%\">\n" +
                "        <tbody>\n" +
                "            <tr>\n" +
                "                <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "                <td>\n" +
                "                    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse: collapse\">\n" +
                "                        <tbody>\n" +
                "                            <tr>\n" +
                "                                <td bgcolor=\"#2EBA62\" width=\"100%\" height=\"50\">\n" +
                "                                    <p style=\"margin: 10px 0 10px 10px; font-size: 25px; font-family: Helvetica; font-weight: 700; line-height: 25px; color: #ffffff\">Вас приветсвует команда MySubs!</p>\n" +
                "                                </td>\n" +
                "                            </tr>\n" +
                "                        </tbody>\n" +
                "                    </table>\n" +
                "                </td>\n" +
                "                <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "            </tr>\n" +
                "        </tbody>\n" +
                "    </table>\n" +
                "    <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse: collapse; max-width: 580px; width: 100% !important\" width=\"100%\">\n" +
                "        <tbody>\n" +
                "            <tr>\n" +
                "                <td height=\"30\"><br></td>\n" +
                "            </tr>\n" +
                "            <tr>\n" +
                "                <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "                <td style=\"font-family: Helvetica, Arial, sans-serif; font-size: 19px; line-height: 1.315789474; max-width: 560px\">\n" +
                "                    <p style=\"margin: 0 0 20px 0; font-size: 19px; line-height: 25px; color: #0b0c0c\">Привет, " + name + "</p>\n" +
                "                    <p style=\"margin: 0 0 20px 0; font-size: 19px; line-height: 25px; color: #0b0c0c\">Спасибо за регистрацию. Чтобы подтвердить регистрацию, кликни на ссылочку ниже:</p>\n" +
                "                    <blockquote style=\"margin: 0 0 20px 0; border-left: 10px solid #b1b4b6; padding: 15px 0 0.1px 15px; font-size: 19px; line-height: 25px\">\n" +
                "                        <p style=\"margin: 0 0 20px 0; font-size: 19px; line-height: 25px; color: #0b0c0c\">\n" +
                "                            <a href=" + link + ">\"Click!\"</a>\n" +
                "                        </p>\n" +
                "                    </blockquote>\n" +
                "                    Срок дейсвия этой ссылки всего 15 минут, поспеши!\n" +
                "                    <p>До скорых встреч!</p>\n" +
                "                </td>\n" +
                "                <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "            </tr>\n" +
                "            <tr>\n" +
                "                <td height=\"30\"><br></td>\n" +
                "            </tr>\n" +
                "        </tbody>\n" +
                "    </table>\n" +
                "    <div class=\"yj6qo\"></div>\n" +
                "    <div class=\"adL\"></div>\n" +
                "</div>";
    }
}
