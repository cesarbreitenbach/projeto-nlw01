
import { Request, Response } from 'express'
import knex from '../database/connection'

class PointsController {
          async create(req: Request, res: Response) {

                    const {
                              image,
                              name,
                              email,
                              whatsapp,
                              latitude,
                              longitude,
                              city,
                              uf,
                              items
                    } = req.body;

                    const trx = await knex.transaction();

                    const point = {
                              image,
                              name,
                              email,
                              whatsapp,
                              latitude,
                              longitude,
                              city,
                              uf
                    }

                    const insertedIds = await trx('points').insert(point);

                    const id_points = insertedIds[0];

                    const pointItems = items.map((id_items: number) => {
                              return {
                                        id_items,
                                        id_points
                              }
                    })

                    await trx('itemspoints').insert(pointItems);

                    await trx.commit();

                    res.json({ id_points, ...point })
          }

          async show(req: Request, res: Response) {
                    const { id }  = req.params;

                    const point = await knex("points")
                                                  .where('id', id)
                                                  .first();

                    if (!point){
                              return res.status(400).json({message:"Point not found"})
                    }
                    
                    const items = await knex('items')
                                                  .join("itemspoints", "items.id", "=", "itemspoints.id_items")
                                                  .distinct()
                                                  .select("title")


                    return res.json({...point, items})


          }
          async index(req: Request, res: Response){
                    const {city, uf, items} = req.query;

                    const parsedItems = String(items)
                                           .split(',')
                                           .map(i=> Number(i.trim()) );

                    const points = await knex("points")
                                                  .join("itemspoints", "points.id", "=", "itemspoints.id_points")
                                                  .whereIn("itemspoints.id_items", parsedItems)
                                                  .where("city", String(city))
                                                  .where("uf", String(uf))
                                                  .select("points.*")
                                                  .distinct()
                    
                    console.log(points)
                    
                    if(points.length==0){
                              return res.status(400).json({message:"No points found"})
                    }

                    return res.json({points})
                                                            
          }
}


export default PointsController;