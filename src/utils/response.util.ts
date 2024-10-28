import { users } from "@prisma/client";
import { tokenAndRefresh } from "../utils/token.util";
import { userResponse } from "../models/user.model";
import { contacts } from "@prisma/client";
import { contactResponse } from "../models/contact.model";
import { addresses } from "@prisma/client";
import  { addressResponse } from "../models/address.model";
import { dataAddress } from "../models/address.model";

export function toUserResponse(
  user: users,
  token?: tokenAndRefresh
): userResponse {
  return {
    data: {
      username: user.username,
      name: user.name,
    },
    newAccessToken: token?.newAccessToken,
  };
}

export function toContactResponse(
  data: contacts,
  token?: tokenAndRefresh
): contactResponse {
  return {
    data: {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
    },
    newAccessToken: token?.newAccessToken,
  };
}

export function toAddressResponse(
  data: addresses,
  token?: tokenAndRefresh
): addressResponse<dataAddress> {
  return {
    data: {
      id: data.id,
      street: data.street || undefined,
      city: data.city || undefined,
      province: data.province || undefined,
      country: data.country,
      postalCode: data.postalCode,
    },
    newAccessToken: token?.newAccessToken,
  };
}
