import { Request, Response } from "express";
import knex from "../database/connection";

class ItemsController {

  async index(req: Request, res: Response) {

    const items = await knex('items').select('*');

    const serializedItems = items.map(i => {
      return {
        id: i.id,
        title: i.title,
        image: 'http://192.168.1.129:3000/uploads/' + i.image
      }
    }) 


    return res.json(serializedItems)
  }
}

export default ItemsController;