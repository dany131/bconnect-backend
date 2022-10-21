import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { ErrorResponseMessages } from "../messages";


@Injectable()
export class RemoteHelper {
  REMOTE_BASE_URL = this.configService.get("REMOTE_BASE_URL");

  constructor(private readonly httpService: HttpService,
              private readonly configService: ConfigService) {
  }

  public async createSession() {
    try {
      const session = await this.httpService.axiosRef.get(`${this.REMOTE_BASE_URL}/sanctum/csrf-cookie`);
      const xsrf = session.headers["set-cookie"][0];
      const xsrfOnly = xsrf.split(";")[0];
      const token = xsrfOnly.split("%")[0];
      const xsrfToken = token.split("=")[1];
      const laravelSession = session.headers["set-cookie"][1];
      const laravelToken = laravelSession.split(";")[0];
      return { xsrfToken, laravelToken };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async remoteUserExists(phoneNumber: string) {
    console.log(this.REMOTE_BASE_URL);
    const response = await this.httpService.axiosRef.get(`${this.REMOTE_BASE_URL}/api/fetch-subscriber/${phoneNumber}`,
      {
        headers: {}
      });
    if (response.status !== 201) throw new Error(ErrorResponseMessages.SOME_PROBLEM);
    return response;
  }

  public async createRemoteCustomer(xsrfToken: string, laravelToken: string, firstName: string, lastName: string,
                                    phoneNumber: string, businessId: number, visitDate: string) {
    try {
      const response = await this.httpService.axiosRef.post(`${this.REMOTE_BASE_URL}/api/create-subscriber`, {
          firstName,
          lastName,
          phoneNumber,
          businessId,
          visitDate
        },
        {
          headers: {
            "X-XSRF-TOKEN": `${xsrfToken}`,
            "Content-Type": "application/json",
            "Cookie": `${xsrfToken}; ${laravelToken};`
          }
        });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async businessLogin(xsrfToken: string, laravelToken: string, email: string, password: string) {
    try {
      const response = await this.httpService.axiosRef.post(`${this.REMOTE_BASE_URL}/api/login`, {
          email,
          password
        },
        {
          headers: {
            "X-XSRF-TOKEN": `${xsrfToken}`,
            "Content-Type": "application/json",
            "Cookie": `${xsrfToken}; ${laravelToken};`
          }
        });
      if (response.status === 201) return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async sendMessageNotification(session: any, msgHeader: string, body: string,
                                       businessId: number, recipientNo: string) {
    const xsrf = session.headers["set-cookie"][0];
    const xsrfOnly = xsrf.split(";")[0];
    const token = xsrfOnly.split("%")[0];
    const xsrfToken = token.split("=")[1];
    const laravelSession = session.headers["set-cookie"][1];
    const laravelToken = laravelSession.split(";")[0];
    const bearerToken = session.data.token.split("|")[1];
    try {
      const response = await this.httpService.axiosRef.post(`${this.REMOTE_BASE_URL}/api/send-single-text`, {
          msgHeader,
          body,
          businessId,
          recipientNo
        },
        {
          headers: {
            "X-XSRF-TOKEN": `${xsrfToken}`,
            "Content-Type": "application/json",
            "Authorization": `Bearer ${bearerToken}`,
            "Cookie": `${xsrfToken}; ${laravelToken};`
          }
        });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

}










