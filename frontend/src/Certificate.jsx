import React from "react";
import {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  View,
  Font,
} from "@react-pdf/renderer";
import signature from "./images/signature.jpg";
import medicine from "./images/medicine.png";
import hwseta from "./images/hwseta.jpg";
// Font.register({
//   family: "Calibri Light",
//   src: "https://fonts.cdnfonts.com/css/calibri-light?styles=15794",
// });

const styles = StyleSheet.create({
  body: {
    paddingVertical: 35,
    paddingHorizontal: 35,
  },
  outterLine: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
  },
  innerLine: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "black",
    padding: 5,
  },
  row: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    borderBottom: 1,
    borderBottomColor: "black",
    marginHorizontal: "auto",
  },
  heading1: {
    fontFamily: "Times-Bold",
    fontSize: 20,
  },
  heading2: {
    fontFamily: "Times-Bold",
    fontSize: 18,
  },
  heading3: {
    fontFamily: "Times-Roman",
    fontWeight: 300,
    fontSize: 14,
  },
  image: {
    width: "50%",
    height: 30,
    marginTop: 10,
  },
});

const Certificate = ({
  first_name,
  last_name,
  course_name,
  id_number,
  completed_date,
}) => {
  return (
    <Document>
      <Page style={styles.body} orientation="landscape">
        <View style={styles.outterLine}>
          <View style={styles.innerLine}>
            <View style={[styles.outterLine, { position: "relative" }]}>
              <View style={{ width: "100%", height: "100%" }}>
                <View style={styles.row}>
                  <Text style={styles.heading1}>Certificate of Completion</Text>
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: 20,
                      flexDirection: "column",
                    },
                  ]}
                >
                  <Text style={styles.heading3}>THIS CERTIFIES THAT</Text>
                  <Text style={[styles.heading2, { marginTop: 25 }]}>
                    {first_name.replace(/\s+/g, " ").trim()}{" "}
                    {last_name.replace(/\s+/g, " ").trim()} {" - "}{" "}
                    {`ID: ${id_number}`}
                  </Text>
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: 10,
                      flexDirection: "column",
                      width: "50%",
                    },
                  ]}
                >
                  <Text style={[styles.heading2, { fontSize: 16 }]}>
                    HAS SUCCESSFULLY COMPLETED
                  </Text>
                  <Text
                    style={[
                      styles.heading3,
                      { marginTop: 25, marginBottom: 10 },
                    ]}
                  >
                    {course_name}
                  </Text>
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: 20,
                      flexDirection: "column",
                      width: "50%",
                      borderBottom: 0,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.heading3,
                      {
                        marginTop: 0,
                        fontSize: 10,
                        // fontFamily: "Calibri Light",
                      },
                    ]}
                  >
                    RUBIN PILLAY Ph.D., M.D., M.B.A, M.Sc, Bsc(Hon)Pharm
                  </Text>
                  <Text
                    style={[
                      styles.heading3,
                      {
                        marginTop: 5,
                        fontSize: 10,
                        // fontFamily: "Calibri Light",
                      },
                    ]}
                  >
                    Professor of Medicine and Professor of Business
                  </Text>
                  <Image
                    style={[
                      styles.image,
                      { height: 30.09448818898, width: 220.13385826772 },
                    ]}
                    src={signature}
                  />
                  <Text
                    style={[
                      styles.heading3,
                      {
                        marginTop: 15,
                        fontSize: 10,
                        // fontFamily: "Calibri Light",
                      },
                    ]}
                  >
                    PROGRAMME DIRECTOR
                  </Text>
                  <Text
                    style={[
                      styles.heading3,
                      {
                        marginTop: 15,
                        fontSize: 10,
                        // fontFamily: "Calibri Light",
                      },
                    ]}
                  >
                    COMPLETED ON: {completed_date}
                  </Text>
                </View>

                <View
                  style={[
                    styles.row,
                    {
                      justifyContent: "space-between",
                      width: "100%",
                      borderBottom: 0,
                      padding: 0,
                      position: "absolute",
                      bottom: 0,
                    },
                  ]}
                >
                  <Image
                    style={[
                      styles.image,
                      {
                        width: 156.09448818898,
                        marginTop: 40,
                        height: 22.125984251969,
                      },
                    ]}
                    src={medicine}
                  />
                  <Image
                    style={[
                      styles.image,
                      { width: 200.92125984252, height: 65.968503937008 },
                    ]}
                    src={hwseta}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Certificate;
