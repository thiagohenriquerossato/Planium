import { Price } from './../Entities/Price';
import { Plan } from "../Entities/Plan";
import fs from 'fs'
import path from "path"

interface IBeneficiarios {
  quantidade: number;
  beneficiarios: IBeneficiario[];
  registro: string;
}

interface IBeneficiario {
  idade: number;
  nome: string;
  valor?: number;
}

class BeneficiariosService{
  private plans: Plan[]
  private prices: Price[]

  constructor(){
    this.plans = require("../json/plans.json");
    this.prices = require("../json/prices.json")
  }

  store({quantidade, registro, beneficiarios}: IBeneficiarios){


    let registoCod = 0
    let plano
    this.plans.forEach(plan =>{
      if(registro===plan.registro){
        registoCod = plan.codigo
        plano = plan
        return
      }
    })
    
    if(registoCod<=0){
      throw "Registro de plano não existe!"
    }
    
    

    let precoProposta: Price =this.prices[1]
    let precos: Price[] = []
    this.prices.forEach(price=>{
      if(price.codigo===registoCod){
        precos.push(price)
        if(quantidade>=price.minimo_vidas){
          precoProposta = price
        }
      }
    });

    fs.writeFile(path.resolve(__dirname,"..", "json", "beneficiarios.json"),JSON.stringify({quantidade, registro, beneficiarios}, null, ' '), err=>{
      if(err) throw new Error(err.message)
      console.log("success")
    })
    
    beneficiarios.forEach(beneficiario=>{
      if(0<=beneficiario.idade && beneficiario.idade<=17)
        beneficiario.valor = precoProposta.faixa1
      else if(18<=beneficiario.idade && beneficiario.idade<=40)
        beneficiario.valor = precoProposta.faixa2
      else if(40<beneficiario.idade)
        beneficiario.valor = precoProposta.faixa3

    })

    
    const valorTotal = beneficiarios.reduce(getTotal, 0);
    function getTotal(total:any, item: any) {
     return item.valor && total + item.valor
    }

    fs.writeFile(path.resolve(__dirname,"..", "json", "proposta.json"),JSON.stringify({quantidade, plano, precos, beneficiarios}, null, ' '), err=>{
      if(err) throw new Error(err.message)
      console.log("success")
    })

    
    return {valorTotal, beneficiarios}
  }

}

export {BeneficiariosService}