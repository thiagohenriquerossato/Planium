import { Request, Response } from "express";
import { BeneficiariosService } from "../services/beneficiariosService";

export const store= (request: Request, response: Response)=>{
  const { registro, beneficiarios} = request.body
  const quantidade = beneficiarios.length
  const service = new BeneficiariosService()
  try {
    const result = service.store({quantidade, registro,beneficiarios})
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({errorMessage: error});
  }

}