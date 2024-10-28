import { NextFunction, Response } from "express";
import { tokenAndRefresh, UserRequest } from "../utils/token.util";
import { contactService } from "../services/contact.service";
import {
  contactRequest,
  contactResponse,
  searchContact,
  updateContactRequest,
} from "../models/contact.model";

export class contactController {
  static async create(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: contactResponse = await contactService.create(
        req.user as tokenAndRefresh,
        req.body as contactRequest
      );
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  static async get(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: contactResponse = await contactService.get(
        req.user as tokenAndRefresh,
        Number(req.params.contactId)
      );
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  static async update(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      req.body.id = Number(req.params.contactId);
      const data = await contactService.update(
        req.user as tokenAndRefresh,
        req.body as updateContactRequest
      );
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  static async remove(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await contactService.remove(
        req.user as tokenAndRefresh,
        Number(req.params.contactId)
      );
      res.status(200).json({ data: "contact berhasil di hapus" });
    } catch (e) {
      next(e);
    }
  }

  static async search(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: searchContact = {
        name: req.query.name as string,
        email: req.query.email as string,
        phone: req.query.phone as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
      };
      const data = await contactService.search(
        req.user as tokenAndRefresh,
        request
      );
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }
}
