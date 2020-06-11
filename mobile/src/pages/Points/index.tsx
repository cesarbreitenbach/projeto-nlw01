import React, { useState, useEffect } from "react"
import { StyleSheet, ScrollView, TouchableOpacity, Text, View, Image, SafeAreaView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import MapView, { Marker } from "react-native-maps"
import { Feather as Icon } from "@expo/vector-icons"
import { SvgUri } from 'react-native-svg'
import api from '../../helpers/api'

interface Items {
          id: number,
          image: string,
          title: string
}

const Points = () => {
          const [items, setItems] = useState<Items[]>([]);
          const navigation = useNavigation();


          useEffect(()=> {



                    async function loadItems(): Promise<void> {
                              const response = await api.get<Items[]>('items');
                              console.log(response.data);
                              setItems(response.data );
                              console.log(items)
                    }


                    // Anteriormente essa chamada a baixo estava normal.. 

                    // api.get('items').then(response => {




                    //           console.log("fiz requisição a api");           
                    //           setItems([...items, response.data])
                    //           // setItems(response.data);
                    //           console.log("setei o estado Items")
                    //           console.log(items)

                    // }).catch(err=>console.log(err))
          }, [])


          function handleGoBack() {
                    navigation.goBack();
          }

          function handleNavigateToDateil() {
                    navigation.navigate('Detail', { teste: "xxx" })
          }


          return (
                    <SafeAreaView style={{ flex: 1 }}>
                              <View style={styles.container}>
                                        <TouchableOpacity onPress={handleGoBack}>
                                                  <Icon name="arrow-left" size={24} color="#34CB79">

                                                  </Icon>
                                        </TouchableOpacity>
                                        <Text style={styles.title}>Bem vindo</Text>
                                        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
                                        <View style={styles.mapContainer}>
                                                  <MapView style={styles.map}
                                                            initialRegion={{
                                                                      latitude: -24.9617719,
                                                                      longitude: -53.4878473,
                                                                      latitudeDelta: 0.014,
                                                                      longitudeDelta: 0.014
                                                            }}
                                                  >
                                                            <Marker
                                                                      onPress={handleNavigateToDateil}
                                                                      coordinate={{
                                                                                latitude: -24.9617719,
                                                                                longitude: -53.4878473
                                                                      }} >
                                                                      <View style={styles.mapMarkerContainer}>
                                                                                <Image style={styles.mapMarkerImage} source={{ uri: 'http://192.168.1.129:3000/uploads/imagemteste.jpg' }} />
                                                                                <Text style={styles.mapMarkerTitle}>Mercado</Text>
                                                                      </View>
                                                            </Marker>
                                                  </MapView>

                                        </View>
                                        <View style={styles.itemsContainer} >
                                                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }} >
                                                            {items.map((item) => {
                                                                     return 
                                                                     
                                                                     (
                                                                                <TouchableOpacity key={item.id} style={styles.item} onPress={() => {}}>
                                                                                          <SvgUri width={42} height={45} uri={item.image} />
                                                                                          <Text style={styles.itemTitle}> {item.title} </Text>
                                                                                </TouchableOpacity>
                                                                      )
                                                            })

                                                            }
                                                  </ScrollView>
                                        </View>
                              </View>
                    </SafeAreaView>

          )
}

export default Points;

const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    paddingHorizontal: 32,
          },

          title: {
                    fontSize: 20,
                    fontFamily: 'Ubuntu_700Bold',
                    marginTop: 24,
          },

          description: {
                    color: '#6C6C80',
                    fontSize: 16,
                    marginTop: 4,
                    fontFamily: 'Roboto_400Regular',
          },

          mapContainer: {
                    flex: 1,
                    width: '100%',
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginTop: 16,
          },

          map: {
                    width: '100%',
                    height: '100%',
          },

          mapMarker: {
                    width: 90,
                    height: 80,
          },

          mapMarkerContainer: {
                    width: 90,
                    height: 70,
                    backgroundColor: '#34CB79',
                    flexDirection: 'column',
                    borderRadius: 8,
                    overflow: 'hidden',
                    alignItems: 'center'
          },

          mapMarkerImage: {
                    width: 90,
                    height: 45,
                    resizeMode: 'cover',
          },

          mapMarkerTitle: {
                    flex: 1,
                    fontFamily: 'Roboto_400Regular',
                    color: '#FFF',
                    fontSize: 13,
                    lineHeight: 23,
          },

          itemsContainer: {
                    flexDirection: 'row',
                    marginTop: 16,
                    marginBottom: 32,
          },

          item: {
                    backgroundColor: '#fff',
                    borderWidth: 2,
                    borderColor: '#eee',
                    height: 120,
                    width: 120,
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingTop: 20,
                    paddingBottom: 16,
                    marginRight: 8,
                    alignItems: 'center',
                    justifyContent: 'space-between',

                    textAlign: 'center',
          },

          selectedItem: {
                    borderColor: '#34CB79',
                    borderWidth: 2,
          },

          itemTitle: {
                    fontFamily: 'Roboto_400Regular',
                    textAlign: 'center',
                    fontSize: 13,
          },
});