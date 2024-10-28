import { addresses, Prisma } from "@prisma/client";
import {
  addressRequest,
  addressResponse,
  dataAddress,
  updateAddressRequest,
} from "../models/address.model";
import { toAddressResponse } from "../utils/response.util";
import { Validation } from "../validation/validation";
import { addressValidation } from "../validation/address.validation";
import { prismaClient, redis } from "../app/database";
import { responseError } from "../utils/Error.util";
import { tokenAndRefresh } from "../utils/token.util";

export class addressService {
  static async checkContact(
    user: tokenAndRefresh,
    contactId: number
  ): Promise<void> {
    const data = await prismaClient.contacts.findUnique({
      where: {
        id: contactId,
        username: user.username,
      },
    });
    if (data == null) {
      throw new responseError("contact is not found", 404);
    }
  }

  static async checkAddress(contactId: number, id: number): Promise<addresses> {
    const data = await prismaClient.addresses.findUnique({
      where: {
        id,
        contactId,
      },
    });

    if (data == null) {
      throw new responseError("address is not found", 404);
    }

    return data;
  }

  static async create(
    user: tokenAndRefresh,
    data: addressRequest
  ): Promise<addressResponse<dataAddress>> {
    data = await Validation.validate(addressValidation.create, data);
    await this.checkContact(user, data.contactId);

    const createAddress = await prismaClient.addresses.create({
      data,
    });

    await redis.del(user.username + data.contactId.toString() + "list");
    return toAddressResponse(createAddress, user);
  }

  static async get(
    user: tokenAndRefresh,
    contactId: number,
    id: number
  ): Promise<addressResponse<dataAddress>> {
    const data = await Validation.validate(addressValidation.get, {
      id,
      contactId,
    });

    const getData = await redis.get(
      user.username + contactId.toString() + id.toString()
    );
    let dataCache;
    if (getData) {
      dataCache = JSON.parse(getData);
    } else {
      await this.checkContact(user, data.contactId);
      dataCache = await this.checkAddress(contactId, id);
      await redis.setex(
        user.username + contactId.toString() + id.toString(),
        3600,
        JSON.stringify(dataCache)
      );
    }

    return toAddressResponse(dataCache, user);
  }

  static async update(
    user: tokenAndRefresh,
    data: updateAddressRequest
  ): Promise<addressResponse<dataAddress>> {
    data = await Validation.validate(addressValidation.update, data);
    await this.checkContact(user, data.contactId);
    await this.checkAddress(data.contactId, data.id);

    const updateAddress = await prismaClient.addresses.update({
      where: {
        id: data.id,
        contactId: data.contactId,
      },
      data,
    });

    await redis.del(
      user.username + data.contactId.toString() + data.id.toString()
    );
    await redis.del(user.username + data.contactId.toString() + "list");
    return toAddressResponse(updateAddress, user);
  }

  static async remove(
    user: tokenAndRefresh,
    contactId: number,
    id: number
  ): Promise<void> {
    const data = await Validation.validate(addressValidation.get, {
      id,
      contactId,
    });
    await this.checkContact(user, data.contactId);
    await this.checkAddress(contactId, id);
    await prismaClient.addresses.delete({
      where: {
        id,
        contactId,
      },
    });
    await redis.del(
      user.username + contactId.toString() + id.toString()
    );
    await redis.del(user.username + contactId.toString() + "list");
  }

  static async list(
    user: tokenAndRefresh,
    contactId: number
  ): Promise<addressResponse<Array<dataAddress>>> {
    const data = await Validation.validate(addressValidation.list, contactId);

    const getData = await redis.get(
      user.username + contactId.toString() + "list"
    );
    let dataCache;
    if (getData) {
      dataCache = JSON.parse(getData);
    } else {
      await this.checkContact(user, data);
      dataCache = await prismaClient.addresses.findMany({
        where: {
          contactId: data,
        },
        select: {
          id: true,
          street: true,
          city: true,
          province: true,
          country: true,
          postalCode: true,
        },
      });

      await redis.setex(
        user.username + contactId.toString() + "list",
        3600,
        JSON.stringify(dataCache)
      );
    }

    return {
      data: dataCache as Array<dataAddress>,
      newAccessToken: user.newAccessToken,
    };
  }
}
