import { contacts } from "@prisma/client";
import {
  contactRequest,
  contactResponse,
  dataContact,
  searchContact,
  updateContactRequest,
} from "../models/contact.model";
import { toContactResponse } from "../utils/response.util";
import { Validation } from "../validation/validation";
import { contactValidation } from "../validation/contact.validation";
import { prismaClient, redis } from "../app/database";
import { responseError } from "../utils/Error.util";
import { pageabel } from "../models/contact.model";
import { tokenAndRefresh } from "../utils/token.util";

export class contactService {
  static async create(
    user: tokenAndRefresh,
    req: contactRequest
  ): Promise<contactResponse> {
    req = await Validation.validate(contactValidation.create, req);
    const data = {
      ...req,
      ...{ username: user.username },
    };
    const createContact = await prismaClient.contacts.create({ data });

    return toContactResponse(createContact, user);
  }

  static async checkDatabase(username: string, id: number): Promise<contacts> {
    const data = await prismaClient.contacts.findUnique({
      where: {
        id,
        username,
      },
    });

    if (data == null) {
      throw new responseError("contact is not found", 404);
    }
    return data;
  }

  static async get(
    user: tokenAndRefresh,
    id: number
  ): Promise<contactResponse> {
    id = await Validation.validate(contactValidation.get, id);
    const getData = await redis.get(user.username + id.toString());
    let data;
    if (getData) {
      data = JSON.parse(getData);
    } else {
      data = await this.checkDatabase(user.username, id);
      await redis.setex(
        user.username + id.toString(),
        3600,
        JSON.stringify(data)
      );
    }

    return toContactResponse(data, user);
  }

  static async update(
    user: tokenAndRefresh,
    req: updateContactRequest
  ): Promise<contactResponse> {
    const data = await Validation.validate(contactValidation.update, req);

    await this.checkDatabase(user.username, data.id);

    const update = await prismaClient.contacts.update({
      where: {
        id: data.id,
        username: user.username,
      },
      data,
    });

    await redis.del(user.username + req.id.toString())
    return toContactResponse(update, user);
  }

  static async remove(user: tokenAndRefresh, id: number): Promise<void> {
    id = await Validation.validate(contactValidation.get, id);
    await this.checkDatabase(user.username, id);

    await prismaClient.addresses.deleteMany({
      where: {
        contactId: id,
      },
    });

    await prismaClient.contacts.delete({
      where: {
        username: user.username,
        id,
      },
    });
    await redis.del(user.username + id.toString());
  }

  static async search(
    user: tokenAndRefresh,
    req: searchContact
  ): Promise<pageabel<dataContact>> {
    const data = await Validation.validate(contactValidation.search, req);
    const skip = (data.page - 1) * data.size;

    const filters = [];
    if (data.name) {
      filters.push({
        OR: [
          {
            firstName: {
              contains: data.name,
            },
          },
          {
            lastName: {
              contains: data.name,
            },
          },
        ],
      });
    }

    if (data.email) {
      filters.push({
        email: {
          contains: data.email,
        },
      });
    }

    if (data.phone) {
      filters.push({
        phone: {
          contains: data.phone,
        },
      });
    }

    const contacts = await prismaClient.contacts.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: data.size,
      skip: skip,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    const total = await prismaClient.contacts.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      data: contacts as Array<dataContact>,
      paging: {
        currentPage: data.page,
        totalPage: Math.ceil(total / data.size),
        size: data.size,
      },
      newAccessToken: user.newAccessToken as string,
    };
  }
}
