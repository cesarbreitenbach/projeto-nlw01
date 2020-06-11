import React, {useEffect, useState, ChangeEvent, FormEvent  } from 'react';
import { FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import './style.css'
import logo from '../../assets/logo.svg'
import {Map,  TileLayer, Marker, Popup} from "react-leaflet"
import {LeafletMouseEvent} from 'leaflet'
import api from '../../helpers/api'
import axios from 'axios'

interface itemsInterface{
          id:number,
          title:string,
          image:string
}
interface ufInterface{
          sigla:string
}
interface cityInterface{
          id:number,
          nome:string
}

interface positionInterface{
          lat:number,
          log:number
}

const CreatePoint = () => {

          const [items, setItems] = useState<itemsInterface[]>([]);
          const [ufs, setUfs] = useState<ufInterface[]>([])
          const[citys, setCitys] = useState<cityInterface[]>([])

          const[selectedUf, setSelectedUf] = useState("0")
          const[selectedCity, setSelectedCity] = useState("0")
          const[position, setPosition] = useState<[number, number]>([0,0])

          const[selectedItems, setSelectedItems] = useState<number[]>([])

          const [formData, setFormData] = useState({
                    name:'',
                    email:'',
                    whats:''
          })

          useEffect(()=>{
                    navigator.geolocation.getCurrentPosition((position)=>{
                              setPosition([position.coords.latitude, position.coords.longitude])
                    })
          }, [])

          useEffect(()=>{
                    if (selectedUf==='0'){
                              return;
                    }
                    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos`).then(res => {
                       setCitys(res.data)
                    })
          }, [selectedUf])

          useEffect(()=>{
                    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
                              setUfs(res.data)
                    })
          }, [])

          useEffect(()=>{
                    api.get('items').then(response=>{
                              setItems(response.data)
                    })
                    console.log("Peguei os items: "+ items)
          }, [])

          function handleUfChange(event : ChangeEvent<HTMLSelectElement>){ 

                    setSelectedUf(event.target.value)


          };

          function handleCityChange(event: ChangeEvent<HTMLSelectElement>){
                    setSelectedCity(event.target.value)
          }

          function handleMapClick(event : LeafletMouseEvent ){
                   
                    setPosition([
                              event.latlng.lat,
                              event.latlng.lng
                    ]);

          };

          function handleInputChange(event: ChangeEvent<HTMLInputElement>){

                    const {name, value} = event.target;

                    setFormData({...formData, [name]:value})

          }

          function handleSelectItem( id:number ){

                    const alreadySelected = selectedItems.findIndex(i=>i===id);

                    if( alreadySelected >= 0){
                              const filteredItems = selectedItems.filter(i=> i!=id)
                              setSelectedItems(filteredItems)
                    } else {
                              setSelectedItems([...selectedItems, id])
                    }

          }

          function handleSubmit(event : FormEvent){
                    event.preventDefault();
                    const {name, email, whats} = formData;

                    const uf = selectedUf;
                    const city = selectedCity;

                    const [latitude, longitude] = position;

                    const items = selectedItems;

                    const image = '';

                    const data = {
                              image,
                              name,
                              email,
                              whatsapp:whats,
                              uf,
                              city,
                              longitude,
                              latitude, 
                              items
                    }

                    console.log(data)

                    api.post('points', data);

                    alert('Coleta criada')

          }

          return (
                    <div id="page-create-point">
                              <header>
                                        <img src={logo} alt="Ecoleta" />
                                        <Link to="/"><FiArrowLeft />Voltar para home</Link>
                              </header>
                              <form onSubmit={handleSubmit} >
                                        <h1>Cadastro do <br /> ponto de coleta</h1>
                                        <fieldset>
                                                  <legend>
                                                            <h2>Dados</h2>
                                                  </legend>
                                                  <div className="field">
                                                            <label htmlFor="name">Nome da Entidade</label>
                                                            <input type="text" name="name" id="name" onChange={handleInputChange}/>
                                                  </div>

                                                  <div className="field-group">
                                                            <div className="field">
                                                                      <label htmlFor="email">Email</label>
                                                                      <input type="email" name="email" id="email"  onChange={handleInputChange}/>
                                                            </div>
                                                            <div className="field">
                                                                      <label htmlFor="whats">Whats</label>
                                                                      <input type="text" name="whats" id="whats"  onChange={handleInputChange}/>
                                                            </div>

                                                  </div>
                                        </fieldset>
                                        <fieldset>
                                                  <legend>
                                                            <h2>Endereço</h2>
                                                            <span>Selecione o endereço no mapa</span>
                                                  </legend>

                                                  <Map center={position} zoom={15} onClick={handleMapClick}>
                                                            <TileLayer
                                                                      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                            /> 
                                                             <Marker position={position}>
                                                                      <Popup>
                                                                                Aqui a gente pode colocar uma <br /> info sobre o local!
                                                                       </Popup>
                                                            </Marker> 
                                                  </Map>
                                                  
                                                  <div className="field-group">
                                                            <div className="field">
                                                                      <label htmlFor="uf">Estado (UF)</label>
                                                                      <select name="uf" id="uf" onChange={handleUfChange}>
                                                                                <option value={"0"}> Selecione um estado </option>
                                                                               { ufs.map( item=>  <option key={item.sigla} value={item.sigla}> {item.sigla} </option> )} 
                                                                      </select>
                                                            </div>
                                                            <div className="field">
                                                                      <label htmlFor="city">Cidade </label>
                                                                      <select name="city" id="city"  onChange={handleCityChange}>
                                                                                <option value={"0"}>Selecione uma Cidade</option>
                                                                                { citys.map( item=>  <option key={item.id} value={item.nome}> {item.nome} </option> )} 
                                                                      </select>
                                                            </div>
                                                  </div>
                                        </fieldset>
                                        <fieldset>
                                                  <legend>
                                                            <h2>Itens de Coleta</h2>
                                                            <span>Selecione um ou mais itens abaixo</span>
                                                  </legend>
                                                  <ul className="items-grid">
                                                            {items.map (item=>{
                                                                      return (
                                                                                <li key={item.id} 
                                                                                     onClick={ ()=>handleSelectItem(item.id) }
                                                                                     className={  selectedItems.includes(item.id)? "selected" : ""  }
                                                                                     >
                                                                                          <img src={item.image} alt={item.title} />
                                                                                          <span>{item.title}</span>
                                                                                </li>
                                                                      )
                                                            })}
                                                  </ul>
                                        </fieldset>
                                        <button type="submit">Cadastrar Ponto</button>
                              </form>
                    </div>
          )
}

export default CreatePoint;