import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BookingModel, CustomerPromoCodeModel, PromoCodeModel, UserModel } from "../../models/schemas";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { UpdateCustomerDetailsDto } from "../../dto/customer";
import { GeneratorsHelper, RegexHelper, RemoteHelper } from "../../common/helpers";


@Injectable()
export class CustomerService {
  constructor(@InjectModel("User") private readonly User: Model<UserModel>,
              @InjectModel("PromoCode") private readonly PromoCode: Model<PromoCodeModel>,
              @InjectModel("CustomerPromoCode") private readonly CustomerPromoCode: Model<CustomerPromoCodeModel>,
              @InjectModel("Booking") private readonly Booking: Model<BookingModel>,
              private generator: GeneratorsHelper,
              private readonly regexHelper: RegexHelper,
              private readonly remoteHelper: RemoteHelper) {
  }

  // Update customer details
  async updateCustomerDetails(businessId: number, customerId: string, userObj: UpdateCustomerDetailsDto) {
    const customer = await this.User.findById(customerId);
    if (!customer) throw new BadRequestException(ErrorResponseMessages.NOT_EXISTS);
    const { userName, email, phoneNumber } = userObj;
    if (customer.email !== email) {
      const userExists = await this.User.findOne({ email, businessId });
      if (userExists) throw new BadRequestException(ErrorResponseMessages.EMAIL_EXISTS);
    }
    customer.userName = userName;
    customer.email = email;
    customer.phoneNumber = phoneNumber;
    await customer.save();
    return { message: SuccessResponseMessages.UPDATED, data: { customer } };
  }

  // Reset password - Sends message notification
  async changeCustomerPassword(customerId: string) {
    const customer = await this.User.findById(customerId);
    if (!customer) throw new BadRequestException(ErrorResponseMessages.NOT_EXISTS);
    const randomPassword = this.generator.randomString(8);
    // To be texted to users phone
    customer.password = await this.generator.hashData(randomPassword);
    await customer.save();
    try {
      const remoteSession = await this.remoteHelper.createSession();
      const businessLoginSession = await this.remoteHelper.businessLogin(remoteSession.xsrfToken, remoteSession.laravelToken,
        "test@test.com", "testpass123");
      await this.remoteHelper.sendMessageNotification(businessLoginSession, "Password changed",
        `Your account password is: ${randomPassword}`, customer.businessId, customer.phoneNumber);
    } catch (e) {
      console.log(e);
    }
    customer.password = undefined;
    return { message: SuccessResponseMessages.UPDATED, data: { customer } };
  }

  // Issue promo-code
  async issuePromoCode(businessId: number, customerId: string, promoCodeId: string) {
    const [customer, promoCode] = await Promise.all([
      this.User.findById(customerId), this.PromoCode.findById(promoCodeId)]);
    if (!customer) throw new BadRequestException(ErrorResponseMessages.USER_NOT_EXISTS);
    if (!promoCode) throw new BadRequestException(ErrorResponseMessages.NOT_PROMO_CODE);
    const customerPromoCode = new this.CustomerPromoCode({ customerId, promoCodeId, businessId });
    await customerPromoCode.save();
    return { message: SuccessResponseMessages.UPDATED, data: { customerPromoCode } };
  }

  // Get business customers
  async getBusinessCustomers(businessId: number, page: number, limit: number) {
    const data = await this.User.find({ businessId }).skip((page - 1) * limit).limit(limit);
    const total: number = await this.User.count({ businessId });
    const lastPage = Math.ceil(total / limit);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

  // Get recent 3 bookings
  async getRecentBookings(customerId: string) {
    const data = await this.Booking.find({ customerId }).sort({ createdAt: -1 }).limit(3);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data };
  }

  // Search customer
  async searchCustomer(searchQuery: string, page: number, limit: number) {
    const regex = new RegExp(this.regexHelper.escapeRegex(searchQuery), "gi");
    let matchQuery: any = { $or: [{ userName: { $regex: regex } }, { email: { $regex: regex } }] };
    const data = await this.User.find(matchQuery).sort({ startDateTime: 1 }).skip((page - 1) * limit).limit(limit);
    const total: number = await this.User.count(matchQuery);
    const lastPage = Math.ceil(total / limit);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

}

//exports.searchByName = async(req, res) => {
//     try {
//         const errors = validationResult(req);
//         if(!errors.isEmpty()) return res.status(400).json({message:errors.array()[0].msg});
//         const page = parseInt(req.query.page);
//         const limit = parseInt(req.query.limit);
//         // Search through regex handles fuzzy search (Works on partial text search)
//         const regex = new RegExp(generators.escapeRegex(req.query.searchQuery), 'gi');
//         const data = await Listing.find({name:{$regex:regex}})
//             .select(["name", "location", "thumbnail", "isPublished"]).skip((page - 1) * limit).limit(limit);
//         // Search through mongo text search (Works on full text search)
//         // const data = await Listing.find(
//         //     {$text:{$search:`${req.query.searchQuery}`}},
//         //     {score:{$meta:"textScore"}}).select(["name", "location", "thumbnail", "isPublished"]).sort({score:{$meta:'textScore'}}).skip((page - 1) * limit).limit(limit);
//         const total = await Listing.count({$text:{$search:req.query.searchQuery}});
//         const lastPage = Math.ceil(total / limit);
//         return res.status(200).json({message:"Search results", data, page, lastPage, total});
//     } catch(error) {
//         console.log(error);
//         return res.status(500).json({message:"Something went wrong"});
//     }
// };