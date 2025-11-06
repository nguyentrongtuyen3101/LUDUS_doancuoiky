import { Router } from "express";
import {AddressController} from "../../../modules/user/manager_profile/address/address.controller.js";

const router= Router();

router.post("/",new AddressController().createAddress);
router.get("/",new AddressController().getAddresses);
router.get("/:addressId",new AddressController().getById);
router.delete("/:addressId",new AddressController().deleteAddress);
router.put("/:addressId",new AddressController().updateAddress);
router.patch("/:addressId",new AddressController().setDefaultAddress);
export default router;