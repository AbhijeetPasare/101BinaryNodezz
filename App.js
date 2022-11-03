import { StatusBar } from 'expo-status-bar';
import { Constants } from 'expo-constants';
import * as Application from 'expo-application';
import { launchImageLibrary } from 'react-native-image-picker';
import { aws } from './keys';
import { styles } from './Style';
import { DocumentPicker } from 'react-native-document-picker';
import { Home } from './components/Home';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
  ImageComponent,
} from 'react-native';
import {RNS3} from 'react-native-aws3';
import * as ImagePicker from 'react-native-image-picker';
import React from 'react';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      s3ImagePath: 'null',
      loading: false,
    };
  }
  // Launch Camera
  cameraLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (res) => {
      console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        this.setState({loading: true});
        this.uploadImagetoServer(res);
      }
    });
  };

  imageGalleryLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, (res) => {
      console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        this.setState({loading: true});
        this.uploadImagetoServer(res);
      }
    });
  };
  uploadImagetoServer = (response) => {
    const file = {
      uri: response.assets[0].uri,
      name: response.assets[0].fileName,
      type: 'image/png',
    };
    const options = {
      bucket: 'phsan',
      region: 'us-east-1',
      accessKey: aws.accessKey,
      secretKey: aws.secretKey,
      successActionStatus: 201,
    };
    RNS3.put(file, options)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
          s3ImagePath: 'null',    
        });
        console.log('Server Response >> ', response);
        if (response.status !== 201)
          throw new Error('Failed to upload image to S3');
        else {
          console.log(
            'Successfully uploaded image to s3. s3 bucket url: ',
            response.body.postResponse.location,
            alert("Upload Success")
          );
          this.setState({
            loading: false,
            s3ImagePath: response.body.postResponse.location,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
//  apiCall = () => {
//   api = 'https://eyun813l64.execute-api.us-east-1.amazonaws.com/prod/response?fileName=file';  
//  let data = {'filename': this.file}
//   axios.get(api,data)
//     .then((response) => {
//       console.log(response);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//   }

// async componentDidMount(){
//   const res =await fetch('https://eyun813l64.execute-api.us-east-1.amazonaws.com/prod/response');
//   const body = await res.json();
//   this.setState({s3ImagePath:body,loading:false});
// }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          {this.state.loading ? (
            <ActivityIndicator
              //visibility of Overlay Loading Spinner
              visible={this.state.loading}
              //Text with the Spinner
              textContent={'Loading...'}
              //Text style of the Spinner Text
              textStyle={styles.spinnerTextStyle}
            />
          ) : (
            <>
              <Image
                source={{uri: this.state.s3ImagePath}}
                style={{width: 200, height: 200}}
              />
              <TouchableOpacity
                onPress={this.cameraLaunch}
                style={styles.button}>
                <Text style={styles.buttonText}>Launch Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.imageGalleryLaunch}
                style={styles.button}>
                <Text style={styles.buttonText}>
                  Pick Image From Gallary
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  }
}