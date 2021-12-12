import React, { Component } from "react";

import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Modal,
  ScrollView,
  Dimensions,
  TextInput,
  UIManager,
  Alert,
} from "react-native";
import { sortBy } from "lodash";
import { EventRegister } from "react-native-event-listeners";
import MeasurementRow from "./MeasurementRow";
import { color, colorNew } from "../../../../../modules/styles/theme";
import { Dropdown } from "react-native-material-dropdown";
import { Header } from "react-native-elements";

var ImagePicker = require("react-native-image-picker");
import firebase from "react-native-firebase";

import { SpinPlus } from "../../../../../components/common/AnimatedComponents/SpinPlus";
import { CircleModal } from "../../../../../components/common/AnimatedComponents/SlideUpModal";
import NewEntry from "../NewEntry";
import { moderateScale } from "react-native-size-matters";
import ProgressPhotos from "../../../../../screens/ProgressPhotos";
import { cancel_round_cross } from "../../../../../images";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const months_fullname = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const measurements1 = [
  {
    createdAt: "",
    weight: "",
    weight: "",
    waist: "",
    biceps: "",
    hips: "",
    thighs: "",
    frontImage: "",
    backImage: "",
    sideImage: "",
  },
  {
    createdAt: "",
    weight: "",
    weight: "",
    waist: "",
    biceps: "",
    hips: "",
    thighs: "",
    frontImage: "",
    backImage: "",
    sideImage: "",
  },
];
const { width, height } = Dimensions.get("window");

export default class extends Component {
  state = {
    showPropModal: false,
    progressPhotos: [],
    showAllPhotos: false,
    modelX: 0,
    modelY: 0,
    weight: "",
    weightUnit: [{ value: "kilograms" }, { value: "pounds" }],
    selectedWeightUnit: "pounds",
    lengthUnit: [{ value: "inches" }, { value: "centimeters" }],
    selectedUnitForHip: "inches",
    selectedUnitForThigh: "inches",
    selectedUnitForBicep: "inches",
    selectedUnitForWaist: "inches",
    measuredHip: "",
    measuredWaist: "",
    measuredThigh: "",
    measuredBicep: "",
    frontImage: "",
    sideImage: "",
    backImage: "",
    editIndex: -1,
    isEditCalled: false,
    deleteIndex: -1,
    isDeleteCalled: false,
    showNewEntryModal: false,
    showPhotoShareModal: false,
    focusedPhoto: null,
  };

  _onSubmit = () => {
    const {
      weight,
      measuredWaist,
      measuredBicep,
      measuredThigh,
      measuredHip,
      selectedWeightUnit,
      selectedUnitForHip,
      selectedUnitForThigh,
      selectedUnitForBicep,
      selectedUnitForWaist,
    } = this.state;

    const measurements = {
      weight: parseFloat(weight),
      waist: parseFloat(measuredWaist),
      biceps: parseFloat(measuredBicep),
      thighs: parseFloat(measuredThigh),
      hips: parseFloat(measuredHip),
      weightUnit: selectedUnitForWeight,
      hipUnit: selectedUnitForHip,
      waistUnit: selectedUnitForWaist,
      bicepUnit: selectedUnitForBicep,
      thighUnit: selectedUnitForThigh,
    };

    this._uploadImages().then((urls) => {
      const [frontImage, backImage, sideImage] = urls;

      this.props.onSubmit({
        ...measurements,
        frontImage,
        backImage,
        sideImage,
      });
    });
  };
  async _uploadImages() {
    const { frontImage, backImage, sideImage } = this.state;

    const paths = [frontImage, backImage, sideImage].map((path) =>
      this._uploadImage(path)
    );

    return Promise.all(paths);
  }
  _uploadImage = (path, mime = "application/octet-stream") => {
    if (path.length === 0) {
      return Promise.resolve(null);
    }

    const sessionId = new Date().getTime();
    const imageRef = firebase
      .storage()
      .ref("measurementImages/")
      .child(sessionId + ".png");

    console.log(imageRef);

    return imageRef
      .putFile(path, { contentType: mime })
      .then(() => {
        return imageRef.getDownloadURL();
      })
      .catch((err) => console.log(err.stack));
  };

  selectPhotoTapped(captureButton) {
    this.setState({
      loading: true,
    });
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */

    const options = {
      title: "Add photo using below options",
      storageOptions: {
        skipBackup: true,
        saveToPhotos: true,
        privateDirectory: true,
        path: "Pictures/myAppPicture/",
      },
      quality: Platform.OS === "ios" ? 0.5 : 0.7,
    };
    ImagePicker.showImagePicker(null, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
        this.setState({
          loading: false,
        });
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
        this.setState({
          loading: false,
        });
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        if (captureButton == "FRONT") {
          this.setState({
            frontImage: response.uri,
            loading: false,
          });
        } else if (captureButton == "BACK") {
          this.setState({
            backImage: response.uri,
            loading: false,
          });
        } else if (captureButton == "SIDE") {
          this.setState({
            sideImage: response.uri,
            loading: false,
          });
        }
      }
    });
  }
  renderNewEntryModal() {
    const { container, fieldHeader, subtitle } = styles;
    const {
      showNewEntryModal,
      weight,
      measuredBicep,
      measuredThigh,
      measuredWaist,
      measuredHip,
      isEditCalled,
    } = this.state;
    if (!this.state.showNewEntryModal) return null;

    return (
      <Modal
        visible={this.state.showNewEntryModal}
        animationType={"slide"}
        transparent={true}
        onRequestClose={() => console.log("")}
      >
        <View
          style={{
            ...styles.modalContainer,
            position: "absolute",
            marginTop: 0,
          }}
        >
          <View style={styles.window}>
            <View style={{ ...styles.dialogue, justifyContent: "center" }}>
              <ScrollView
                contentContainerStyle={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                  flexDirection: "row",
                }}
                scrollEnabled={true}
              >
                <View
                  style={{
                    width: "100%",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginBottom: 30,
                    marginTop: 30,
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.modalHeaderText,
                      marginTop: 10,
                      marginBottom: 10,
                      fontSize: 17,
                      height: 35,
                    }}
                  >
                    NEW PROGRESS ENTRY
                  </Text>
                  <Text
                    onPress={this._playHowToVideo}
                    allowFontScaling={false}
                    style={{ ...subtitle, fontSize: 9, marginBottom: 10 }}
                  >
                    LEARN HOW TO TAKE MEASUREMENTS
                  </Text>
                  {this._renderPhotos()}
                  <View
                    style={{
                      width: width * 0.7,
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      margin: 25,
                    }}
                  >
                    <Text
                      onPress={this._playHowToVideo}
                      allowFontScaling={false}
                      style={{ ...fieldHeader }}
                    >
                      Weight
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        alignItems: "flex-start",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      <TextInput
                        textAlign={"center"}
                        editable={true}
                        style={[
                          styles.textInputStyle,
                          {
                            width: width * 0.15,
                            marginTop: 20,
                            textAlign: "left",
                          },
                        ]}
                        placeholder={""}
                        placeholderTextColor={color.mediumGrey}
                        onChangeText={(weight) => {
                          this.setState({ weight });
                        }}
                      >
                        {weight}
                      </TextInput>
                      <Dropdown
                        label=""
                        containerStyle={{
                          width: width * 0.22,
                          marginTop: -20,
                          marginLeft: 20,
                          marginRight: 30,
                        }}
                        onChangeText={(value, index, data) => {
                          this.setState({ selectedWeightUnit: value });
                        }}
                        value={this.state.selectedWeightUnit}
                        data={this.state.weightUnit}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      width: width * 0.7,
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      margin: 15,
                    }}
                  >
                    <Text
                      onPress={this._playHowToVideo}
                      allowFontScaling={false}
                      style={{ ...fieldHeader }}
                    >
                      Waist Measurement
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        alignItems: "flex-start",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      <TextInput
                        textAlign={"center"}
                        editable={true}
                        style={[
                          styles.textInputStyle,
                          {
                            width: width * 0.15,
                            marginTop: 20,
                            textAlign: "left",
                          },
                        ]}
                        placeholder={""}
                        placeholderTextColor={color.mediumGrey}
                        onChangeText={(measuredWaist) => {
                          this.setState({ measuredWaist });
                        }}
                      >
                        {measuredWaist}
                      </TextInput>
                      <Dropdown
                        label=""
                        containerStyle={{
                          width: width * 0.22,
                          marginTop: -20,
                          marginLeft: 20,
                          marginRight: 30,
                        }}
                        onChangeText={(value, index, data) => {
                          this.setState({ selectedUnitForWaist: value });
                        }}
                        value={this.state.selectedUnitForWaist}
                        data={this.state.lengthUnit}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      width: width * 0.7,
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      margin: 15,
                    }}
                  >
                    <Text
                      onPress={this._playHowToVideo}
                      allowFontScaling={false}
                      style={{ ...fieldHeader }}
                    >
                      Bicep Measurement
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        alignItems: "flex-start",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      <TextInput
                        textAlign={"center"}
                        editable={true}
                        style={[
                          styles.textInputStyle,
                          {
                            width: width * 0.15,
                            marginTop: 20,
                            textAlign: "left",
                          },
                        ]}
                        placeholder={""}
                        placeholderTextColor={color.mediumGrey}
                        onChangeText={(measuredBicep) => {
                          this.setState({ measuredBicep });
                        }}
                      >
                        {measuredBicep}
                      </TextInput>
                      <Dropdown
                        label=""
                        containerStyle={{
                          width: width * 0.22,
                          marginTop: -20,
                          marginLeft: 20,
                          marginRight: 30,
                        }}
                        onChangeText={(value, index, data) => {
                          this.setState({ selectedUnitForBicep: value });
                        }}
                        value={this.state.selectedUnitForBicep}
                        data={this.state.lengthUnit}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      width: width * 0.7,
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      margin: 15,
                    }}
                  >
                    <Text
                      onPress={this._playHowToVideo}
                      allowFontScaling={false}
                      style={{ ...fieldHeader }}
                    >
                      Thigh Measurement
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        alignItems: "flex-start",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      <TextInput
                        textAlign={"center"}
                        editable={true}
                        style={[
                          styles.textInputStyle,
                          {
                            width: width * 0.15,
                            marginTop: 20,
                            textAlign: "left",
                          },
                        ]}
                        placeholder={""}
                        placeholderTextColor={color.mediumGrey}
                        onChangeText={(measuredThigh) => {
                          this.setState({ measuredThigh });
                        }}
                      >
                        {measuredThigh}
                      </TextInput>
                      <Dropdown
                        label=""
                        containerStyle={{
                          width: width * 0.22,
                          marginTop: -20,
                          marginLeft: 20,
                          marginRight: 30,
                        }}
                        onChangeText={(value, index, data) => {
                          this.setState({ selectedUnitForThigh: value });
                        }}
                        value={this.state.selectedUnitForThigh}
                        data={this.state.lengthUnit}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      width: width * 0.7,
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      margin: 15,
                    }}
                  >
                    <Text
                      onPress={this._playHowToVideo}
                      allowFontScaling={false}
                      style={{ ...fieldHeader }}
                    >
                      Hip Measurement
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        alignItems: "flex-start",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      <TextInput
                        textAlign={"center"}
                        editable={true}
                        style={[
                          styles.textInputStyle,
                          {
                            width: width * 0.15,
                            marginTop: 20,
                            textAlign: "left",
                          },
                        ]}
                        placeholder={""}
                        placeholderTextColor={color.mediumGrey}
                        onChangeText={(measuredHip) => {
                          this.setState({ measuredHip });
                        }}
                      >
                        {measuredHip}
                      </TextInput>
                      <Dropdown
                        label=""
                        containerStyle={{
                          width: width * 0.22,
                          marginTop: -20,
                          marginLeft: 20,
                          marginRight: 30,
                        }}
                        onChangeText={(value, index, data) => {
                          this.setState({ selectedUnitForHip: value });
                        }}
                        value={this.state.selectedUnitForHip}
                        data={this.state.lengthUnit}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      height: 40,
                      width: "100%",
                      marginLeft: "5%",
                      marginTop: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity onPress={() => this.closeNewEntryView()}>
                      <View
                        style={{
                          height: 40,
                          marginRight: 20,
                          marginTop: 0,
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 1,
                          backgroundColor: colorNew.mediumPink,
                          borderColor: colorNew.cardioButtonBG,
                          borderRadius: 20,
                        }}
                      >
                        <Text
                          allowFontScaling={false}
                          style={{
                            ...styles.modalHeaderText,
                            color: "#fff",
                            fontWeight: "normal",
                            height: 30,
                            marginTop: 5,
                            marginRight: 50,
                            marginLeft: 50,
                          }}
                        >
                          {isEditCalled ? "Update" : "Add New Entry"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  _renderPhotos() {
    const { photoRowContainer, text } = styles;
    const { loading } = this.state;

    return (
      <View style={{ ...photoRowContainer, marginTop: 20 }}>
        {["FRONT", "BACK", "SIDE"].map((photoAngle, idx) => {
          const Photo = () => (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this._renderPhoto(photoAngle)}
              <Text allowFontScaling={false} style={text}>
                {photoAngle}
              </Text>
            </View>
          );

          if (loading) {
            return <Photo key={idx} />;
          }

          return (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.selectPhotoTapped(photoAngle)}
              key={idx}
            >
              <Photo />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  _renderPhoto(photoAngle) {
    const { photoFrame } = styles;
    const uri = {
      FRONT: this.state.frontImage,
      SIDE: this.state.sideImage,
      BACK: this.state.backImage,
    }[photoAngle];

    return (
      <View style={photoFrame}>
        {uri === "" ? (
          <Image
            style={{ width: 33, height: 33, alignSelf: "center" }}
            source={require("./images/iconCamera.png")}
          />
        ) : (
          <Image style={{ width: 70, height: 70 }} source={{ uri }} />
        )}
      </View>
    );
  }
  componentDidMount() {
    this.addProgressPhotosToState();
  }
  addProgressPhotosToState() {
    const { measurements } = this.props;
    var photos = [];
    if (measurements.length > 0) {
      for (const measurement of measurements) {
        console.log(measurement);
        let frontImage = measurement.frontImage ? measurement.frontImage : "";
        console.log(frontImage);
        if (frontImage.length > 0) {
          photos.push(frontImage);
        }
        let backImage = measurement.backImage ? measurement.backImage : "";
        console.log(backImage);
        if (backImage.length > 0) {
          photos.push(backImage);
        }
        let sideImage = measurement.sideImage ? measurement.sideImage : "";
        console.log(sideImage);
        if (sideImage.length > 0) {
          photos.push(sideImage);
        }
      }
      console.log("\n\n\nphotos : ====>");
      console.log(photos);
      this.setState({ progressPhotos: photos });
      setTimeout(() => {
        console.log("\n\n\nthis.state.progressPhotos : ====>");
        console.log(this.state.progressPhotos);
      }, 500);
    }
  }
  _onPhotoPress = (imgUrl) => {
    console.log("_onPhotoPress");
    console.log(imgUrl);
    this.setState({
      showPhotoShareModal: true,
      focusedPhoto: imgUrl,
    });
  };

  _onPhotoModalClose = () => {
    this.setState({
      showPhotoShareModal: false,
      focusedPhoto: initialState.focusedPhoto,
    });
  };
  _renderPhotoModal = () => {
    const { focusedPhoto, showPhotoShareModal } = this.state;

    console.log("_renderPhotoModal");
    console.log(focusedPhoto);

    return (
      <Modal
        animationType="slide"
        visible={showPhotoShareModal}
        onRequestClose={() => this.setState({ showPhotoShareModal: false })}
      >
        <View style={{ flex: 1 }}>
          <Header
            leftComponent={
              <TouchableOpacity
                onPress={() => this.setState({ showPhotoShareModal: false })}
              >
                <Image
                  style={{ tintColor: "#000" }}
                  source={cancel_round_cross}
                />
              </TouchableOpacity>
            }
            centerComponent={{ text: "", style: styles.headerTitle }}
            backgroundColor={"#ffffff"}
            outerContainerStyles={{ borderBottomWidth: 0 }}
          />
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ScrollView
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }} //flexbox styles centerContent //centers content when zoom is less than scroll view bounds
              maximumZoomScale={this.props.maximumZoomScale}
              minimumZoomScale={this.props.minimumZoomScale}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ref={this.setZoomRef} //helps us get a reference to this ScrollView instance
              style={{ overflow: "hidden", flex: 1 }}
            >
              <View
                style={{
                  width: width,
                  justifyContent: "center",
                  alignItems: "center",
                  height: height * 0.9,
                }}
              >
                {
                  <Image
                    style={{
                      resizeMode: "center",
                      width: width,
                      height: "100%",
                      backgroundColor: "transparent",
                    }}
                    source={{ uri: focusedPhoto }}
                  />
                }
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  render() {
    const { measurements } = this.props;
    // console.log('measurements props', this.props)
    // console.log("this.props : " + this.props);
    // const { measurements } = this.props.screenProps;
    // console.log("measurements : ", measurements);
    // console.log("measurements : ", sortBy(measurements, m => m.createdAt).reverse());
    return (
      <View style={{ marginBottom: 75 }}>
        <View>
          {this._renderHeader()}
          {measurements.length > 0 &&
            sortBy(measurements, (m) => m.createdAt)
              .reverse()
              .map((item, index) => this._renderRow({ item, index }))}
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          {measurements.length > 0 && (
            <View style={{ margin: 5 }}>
              <TouchableHighlight
                style={styles.buttonStyle}
                onPress={this.onViewAllPhotoPressed}
                underlayColor={"#ee90af"}
              >
                {
                  <Text allowFontScaling={false} style={styles.buttonText}>
                    View All Entries
                  </Text>
                }
              </TouchableHighlight>
            </View>
          )}
          <View style={{ margin: 5 }}>
            <TouchableHighlight
              style={styles.buttonStyle}
              onPress={this.viewProgressPhotoBuilder}
              underlayColor={"#ee90af"}
            >
              {
                <Text allowFontScaling={false} style={styles.buttonText}>
                  Create Progress Photo
                </Text>
              }
            </TouchableHighlight>
          </View>
        </View>
        {this.renderNewEntryModal()}
        {this._renderPhotoModal()}
        <ProgressPhotos
          {...this.props}
          onClose={this._closeAllPhotoPressed}
          visible={this.state.showAllPhotos}
        />
        {this.state.isDeleteCalled ? this.finalDeleteCalled() : null}
      </View>
    );
  }

  onAddPressed = (evnt) => {
    //console.log('evnt', evnt?.nativeEvent?.locationX)
    console.log("this.spinPlus", this.spinPlus);
    //EventRegister.emit("paywallEvent", this._addNewMeasurement)
    this.spinPlus.measure((fx, fy, width, height, px, py) => {
      console.log("Component width is: " + width);
      console.log("Component height is: " + height);
      console.log("X offset to frame: " + fx);
      console.log("Y offset to frame: " + fy);
      console.log("X offset to page: " + px);
      console.log("Y offset to page: " + py);

      this.setState({ modalX: px, modalY: py, showAddModal: true });
    });
  };

  onViewAllPhotoPressed = () => {
    // console.log("onViewAllPhotoPressed")
    // console.log(this.state.progressPhotos);
    this.setState({
      showAllPhotos: true,
    });
  };

  onViewAllEntries = () => {
    this.props.navigation.navigate("MeasurementList");
  };

  viewProgressPhotoBuilder = () => {
    this.props.navigation.navigate("ProgressPhotoBuilder", {
      props: this.props,
    });
  };

  _closeAllPhotoPressed = () => {
    console.log("_closeAllPhotoPressed");
    this.setState({
      showAllPhotos: false,
    });
  };

  _renderHeader = () => {
    const {
      headerText,
      rowContainer,
      addButton,
      measurementsSubtitle,
      measurementsTitle,
    } = styles;
    const { showAddModal, isEditCalled, editIndex } = this.state;
    const { screenProps } = this.props;
    const { measurements } = screenProps;

    var header_View = (
      <View>
        <CircleModal
          visible={showAddModal}
          onDismiss={() =>
            this.setState({
              showAddModal: false,
              isEditCalled: false,
              editIndex: -1,
            })
          }
        >
          <NewEntry
            screenProps={screenProps}
            isForEdit={isEditCalled}
            editIndex={editIndex}
            measurements={sortBy(measurements, (m) => m.createdAt).reverse()}
            onClose={() =>
              this.setState({
                showAddModal: false,
                isEditCalled: false,
                editIndex: -1,
              })
            }
          />
        </CircleModal>
        <View>
          <Text allowFontScaling={false} style={headerText}>
            Progress Tracking
          </Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            backgroundColor: colorNew.lightPink,
            alignItems: "center",
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={this.onAddPressed}
            style={{ width: "100%" }}
          >
            <View style={{ flexDirection: "column" }}>
              <View style={rowContainer}>
                <View style={addButton} ref={(view) => (this.spinPlus = view)}>
                  <SpinPlus onPress={() => {}} />
                </View>
                <Text allowFontScaling={false} style={measurementsTitle}>
                  Add New Entry
                </Text>
                <View />
              </View>
              <Text allowFontScaling={false} style={measurementsSubtitle}>
                ADD MEASUREMENTS, PHOTOS, AND WEIGH IN
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
    return header_View;
  };

  editPress(item) {
    const { measurements } = this.props;

    var index = measurements.indexOf(item);

    console.log("onEditPress for item : " + index);
    var data = sortBy(measurements, (m) => m.createdAt).reverse()[index];

    this.setState({
      showAddModal: true,
      isEditCalled: true,
      editIndex: index,
      backImage: data["backImage"],
      frontImage: data["frontImage"],
      sideImage: data["sideImage"],
      measuredHip: data["hips"],
      measuredWaist: data["waist"],
      measuredThigh: data["thighs"],
      measuredBicep: data["biceps"],
      selectedUnitForHip: data["hipUnit"],
      selectedUnitForThigh: data["thighUnit"],
      selectedUnitForBicep: data["bicepUnit"],
      selectedUnitForWaist: data["waistUnit"],
      weight: data["weight"],
      selectedWeightUnit: data["weightUnit"],
    });
  }

  deletePress(item) {
    var index = measurements.indexOf(item);
    console.log("onDeletePress for item : " + index);
    Alert.alert("", "Are you sure you want to delete this Progress Entry?", [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () =>
          this.setState({ isDeleteCalled: true, deleteIndex: index }),
      },
    ]);
  }

  finalDeleteCalled() {
    console.log("finalDeleteCalled");
    const { measurements } = this.props;
    var data = sortBy(measurements, (m) => m.createdAt).reverse();
    data.splice(this.state.deleteIndex, 1);
    console.log("final Data after delete : " + data);
    this.props.updateMeasurement(data);
    this.setState({ isDeleteCalled: false, deleteIndex: -1 });
    return null;
  }

  _renderRow = ({ item, index }) => {
    const {
      createdAt,
      weight,
      weightUnit,
      waist,
      biceps,
      hips,
      thighs,
      frontImage,
      backImage,
      sideImage,
    } = item;
    console.log("Vishal : _renderRow - index - " + index);
    const date = new Date(createdAt);
    // const date = new Date();
    // const month = months[date.getMonth()]
    const month = months_fullname[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    console.log("weightUnit : " + weightUnit);
    let weight_unit =
      weightUnit == undefined
        ? "lbs"
        : weightUnit == "kilograms"
        ? "kg"
        : "lbs";
    console.log(weight_unit);
    console.log(date);
    console.log("year : ==> ");
    console.log(year);

    return (
      <MeasurementRow
        data={item}
        dataIndex={index}
        editPress={() => this.editPress(item)}
        deletePress={() => this.deletePress(item)}
        onPhotoPress={this._onPhotoPress}
        date={day}
        year={year}
        month={month}
        weightUnit={weight_unit}
        weight={weight}
        waist={waist}
        arms={biceps}
        hips={hips}
        thighs={thighs}
        photoURIs={[frontImage, backImage, sideImage]}
      />
    );
  };

  closeNewEntryView() {
    this._onSubmit();
    this.setState({ showNewEntryModal: false });
  }
  _addNewMeasurement = () => {
    // this.props.addButtonPress();
    this.setState({ showNewEntryModal: true });
  };

  _closePropModal = () => {
    this.setState({
      showPropModal: false,
    });
  };
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  buttonStyle: {
    width: 315,
    height: 48,
    borderRadius: 100,
    backgroundColor: colorNew.mediumPink,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontFamily: "SF Pro Text",
    fontSize: 22,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#000",
    marginTop: 20,
    marginBottom: 20,
    // textShadowColor: color.hotPink,
    // textShadowRadius: 10
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: "transparent",
  },
  measurementsTitle: {
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#fff",
    marginLeft: 5,
    marginTop: 5,
  },
  measurementsSubtitle: {
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#fff",
    width: "100%",
    // marginLeft: 20,
    marginBottom: 20,
  },
  buttonText: {
    width: "95%",
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    marginTop: 0,
    height: height,
    width: width,
  },
  window: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bfbfbf80",
    height: "100%",
    width: "100%",
  },
  dialogue: {
    width: "90%",
    height: height * 0.8,
    borderRadius: 50,
    borderWidth: 0,
    borderColor: colorNew.bgGrey,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  modalHeaderText: {
    width: "90%",
    height: "15%",
    marginTop: 50,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink,
  },
  photoRowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  photoFrame: {
    width: 70,
    height: 70,
    backgroundColor: "transparent",
    borderStyle: "dashed",
    borderColor: "#ddd",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#aaa",
    marginTop: 10,
  },
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "fff",
    width: "100%",
    height: "100%",
    zIndex: 2,
    flexGrow: 1,
  },
  fieldHeader: {
    fontFamily: "SF Pro Text",
    fontSize: 17,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "left",
    color: colorNew.borderGrey,
  },
  subtitle: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: colorNew.teal,
    textDecorationLine: "underline",
  },
  textInputStyle: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 2,
    textAlignVertical: "bottom",
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black,
    borderBottomColor: colorNew.boxGrey,
    borderBottomWidth: 1,
    fontSize: 16,
  },
  rowContainer: {
    padding: 8,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "transparent",
    alignItems: "center",
  },
};
