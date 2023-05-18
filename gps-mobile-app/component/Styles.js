import { StyleSheet } from 'react-native'

const mapStyles = StyleSheet.create({
    map: {
      
      ...StyleSheet.absoluteFillObject,
      
    },
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent:'space-between',
    },
    text: {
        padding: 5,
        borderRadius: 8,
        fontSize: 19,
        backgroundColor: 'dodgerblue',
        color: 'white',
        textAlignVertical: 'center',
        textAlign: 'center',
  
    },
    textOff: {
      padding: 5,
      borderRadius: 8,
      fontSize: 19,
      backgroundColor: 'gray',
      color: 'white',
      textAlignVertical: 'center',
      textAlign: 'center',
  },
  botMenus: {
    flexDirection:'row-reverse', 
    justifyContent:'space-between',
  },
  menu: {
    alignSelf: 'flex-end',
    flexDirection: 'column',
    bottom: 5,
    borderRadius: 8,
    padding:5,
    marginRight: 5,
    marginTop: 90,
    },
  menuElement: {
      marginVertical: 5,
  },
  editMenu: {
  alignSelf: 'flex-end',  
  flexDirection: 'column',
  bottom: 5,
  backgroundColor: 'white',
  borderRadius: 8,
  padding:5,
  marginLeft: 5,
  marginTop: 10,
  width: 250,
  },
  input: {
    fontSize: 19,
    borderWidth: 2,
    padding: 5,
    borderColor: 'grey',
  },
  rowButtonsContainer: {
    flexDirection:'row', 
    justifyContent:'space-between', 
    marginHorizontal:-5,
  },
  rowButton: {
    flex: 1,
    margin:5,
  },
  topBarContainer: {
    flex: 1,
  },
  topBar: {
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems : 'center',
    borderRadius: 8,
    padding:10,
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
    },
  topBarList: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 20,
    },
  topBarInfo: {
      flex: 8 ,
      flexDirection: 'column'
  },
  topBarText: {
    fontSize: 19,
    },
    
  });
  
  const customMapStyle =[
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
         { visibility: "off" }
        ]
    },
    {
      featureType: "transit",
      stylers:  [{ "visibility": "off" }]
    }
  ];

  const historyStyles = StyleSheet.create({
    container: {
      flex: 1,
      allignitems: 'center',
      justifycontent: 'center',
      padding: 10,
      backgroundColor: 'white',
    },
    textInput: {
      fontSize: 19,
      borderWidth: 2,
      padding: 5,
      borderColor: 'grey',
    },
    textInputInvalid: {
      fontSize: 19,
      borderWidth: 2,
      padding: 5,
      borderColor: 'red',
    },
    textInputFocus: {
      fontSize: 19,
      borderWidth: 3,
      padding: 5,
      borderColor: 'grey',
    },
    textInputFocusInvalid: {
      fontSize: 19,
      borderWidth: 3,
      padding: 5,
      borderColor: 'red',
    },
    text: {
      paddingHorizontal: 1,
      color: 'black',
      fontWeight: 'bold',
    },
    button: {
      marginVertical: 10,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 19,
      padding: 5,
    },
    title: {
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 26,
      marginBottom: 15,
    },
    passwordHiddeIcon: {
      position: 'absolute',
      alignSelf: 'flex-end',
      padding: 10,
    },
    passwordShowIcon: {
      position: 'absolute',
      alignSelf: 'flex-end',
      padding: 10,
    },
    passwordContainer:
    {
      justifyContent: 'center',
    },
  });

  const devicesStyles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  item: { 
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
    marginVertical: 8,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 24,
    padding: 5,
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 26,
    marginBottom: 15,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    allignitems: 'center',
    justifycontent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  updateMenuContainer: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'white',
    allignitems: 'center',
    justifycontent: 'center',
    padding: 10,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
    },
  listMenuContainer: {
      flexDirection:'row', 
      justifyContent:'space-between', 
      marginHorizontal:-5,
      paddingTop: 10,
      marginHorizontal: 5,
      backgroundColor: 'white'
  },
  menuContainer: {
    flexDirection:'row', 
    justifyContent:'space-between', 
    marginHorizontal:-5,
    paddingTop: 5,
    backgroundColor: 'white'
  },
  menuElement: {
    flex: 1,
    margin:5,
  },

});

export { mapStyles, customMapStyle , historyStyles, devicesStyles }