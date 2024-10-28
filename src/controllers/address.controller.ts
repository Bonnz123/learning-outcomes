import { NextFunction, Response } from "express";
import { tokenAndRefresh, UserRequest } from "../utils/token.util";
import { addressService } from "../services/address.service";
import { addressRequest, updateAddressRequest } from "../models/address.model";

export class addressController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      req.body.contactId = Number(req.params.contactId);
      const data = await addressService.create(
        req.user as tokenAndRefresh,
        req.body as addressRequest
      );
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const data = await addressService.get(
        req.user as tokenAndRefresh,
        Number(req.params.contactId),
        Number(req.params.addressId)
      );
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      req.body.contactId = Number(req.params.contactId);
      req.body.id = Number(req.params.addressId);
      const data = await addressService.update(
        req.user as tokenAndRefresh,
        req.body as updateAddressRequest
      );
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await addressService.remove(
        req.user as tokenAndRefresh,
        Number(req.params.contactId),
        Number(req.params.addressId)
      );
      res.status(200).json({ data: "address berhasil di hapus" });
    } catch (e) {
      next(e);
    }
  }

  static async list(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const data = await addressService.list(
        req.user as tokenAndRefresh,
        Number(req.params.contactId)
      );
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }
}
