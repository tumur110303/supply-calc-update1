import { StyleSheet, Text, ScrollView, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Textfield from "../../../components/Textfield";
import { dark, gray, light, main, w400, w500 } from "../../../constants";
import Button from "../../../components/Button";
import CalcContext from "../../../context/CalcContext";
import FormPicker from "../../../components/FormPicker";
import FormSwitch from "../../../components/FormSwitch";
import Modal from "../../../components/ResultModal";
import CountContext from "../../../context/CountContext";

type Error = {
  number: boolean;
  load: boolean;
};

type Value = {
  number?: string;
  load?: string;
  cable: string;
};

const HouseCalculatorScreen = () => {
  const calcContext = useContext(CalcContext);
  const { increase } = useContext(CountContext);
  // Гол өгөгдөл...
  const [value, setValue] = useState<Value>({ cable: "AC1" });
  //   Үр дүн, хариу...
  const [result1, setResult1] = useState<any>([]);
  const [result2, setResult2] = useState<any>([]);
  //   Таблица...
  //   Шаардлагын коэффициент...
  const numberUse = [14, 20, 30, 40, 50, 60, 70];
  const tableUse = [0.8, 0.65, 0.6, 0.55, 0.5, 0.48, 0.45];
  //   Ачаалал зэрэгцэлтийн коэффициент...
  const azNumber = [5, 6, 9, 12, 15, 18, 24, 40, 60, 100, 200, 400, 600];
  const azkTable = [
    1, 0.51, 0.38, 0.32, 0.29, 0.26, 0.24, 0.2, 0.18, 0.16, 0.14, 0.13, 0.11,
  ];

  //   Туслах...
  const [err, setErr] = useState<Error>({ number: false, load: false });
  const [threeCategory, setThreeCategory] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const cables = [
    { label: "АВБбШв", value: "AC1" },
    { label: "АВВГ", value: "AC2" },
    { label: "ВВГ", value: "CC1" },
    { label: "КГ", value: "CC2" },
  ];

  // ############################ ФОРМТОЙ АЖИЛЛАХ ФУНКЦ ###############################
  const valueChanger = (
    text: string,
    id: keyof Value | [keyof Value, "number"],
    validation?: [number, number]
  ) => {
    const key = typeof id === "object" ? id[0] : id;

    // Error шалгах хэсэг...
    const utga = parseInt(text);
    if (validation) {
      if (utga < validation[0] || utga > validation[1]) {
        setDisable(true);
        setErr((err: any) => {
          const copy = { ...err };
          copy[key] = true;
          return copy;
        });
      } else {
        setDisable(false);
        setErr((err: any) => {
          const copy = { ...err };
          copy[key] = false;
          return copy;
        });
      }
    } else {
      setDisable(false);
      setErr((err: any) => {
        const copy = { ...err };
        copy[key] = false;
        return copy;
      });
    }

    // Утга өөрлчөх хэсэг...
    if (text !== "") {
      const number = utga;

      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = number;
        return copy;
      });
    } else {
      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = "";
        return copy;
      });
    }
  };
  const valueChangerButarhai = (
    text: string,
    id: keyof Value | [keyof Value, "load"],
    validation?: [number, number]
  ) => {
    const key = typeof id === "object" ? id[0] : id;

    // Error шалгах хэсэг...
    const utga = parseInt(text);
    if (validation) {
      if (utga < validation[0] || utga > validation[1]) {
        setDisable(true);
        setErr((err: any) => {
          const copy = { ...err };
          copy[key] = true;
          return copy;
        });
      } else {
        setDisable(false);
        setErr((err: any) => {
          const copy = { ...err };
          copy[key] = false;
          return copy;
        });
      }
    } else {
      setDisable(false);
      setErr((err: any) => {
        const copy = { ...err };
        copy[key] = false;
        return copy;
      });
    }

    // Утга өөрлчөх хэсэг...
    if (text !== "") {
      const number = text;

      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = number;
        return copy;
      });
    } else {
      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = "";
        return copy;
      });
    }
  };

  const reset = () => {
    setValue(() => {
      const copy: any = {};
      copy.cable = "AC1";
      return copy;
    });

    setThreeCategory(false);
    setVisible(false);
  };

  // Button идэвхгүй болгох эсэхийг шийдэх функц...
  const disableCheck = () => {
    setDisable(() => !value.number || !value.load);
  };

  useEffect(() => {
    disableCheck();
  }, [value]);

  // ############################## ГОЛ ТООЦООЛОХ ФУНКЦ #################################
  const calc = async () => {
    if (calcContext) {
      let number = 0;
      let load = 0;
      let coeffUse: number | undefined = 0.8;
      let coefAzk: number | undefined = 1;
      if (value.number) number = parseInt(value.number);
      if (value.load) load = parseFloat(value.load);

      // Ачаалал зэрэгцэлтийн коэффициент тодорхойлох...
      if (number < 6) coefAzk = 1;
      else if (number > 600) coefAzk = 0.11;
      else coefAzk = calcContext.interpolation(number, azNumber, azkTable);

      // Шаардлагын коэффициент тодорхойлох...
      if (load < 14) coeffUse = 0.8;
      else if (load > 70) coeffUse = 0.45;
      else coeffUse = calcContext.interpolation(load, numberUse, tableUse);

      // Нэг амины сууцны тооцоо...
      const power = coeffUse ? load * coeffUse : 0;
      const threeSq = Math.sqrt(3);
      const huwaari = threeSq * 380 * 0.98;
      const current = (1000 * power) / huwaari;

      const { circuitBreakerCurrent, wireCable } =
        calcContext.wireCircuitBreakerThreePhase(value.cable, current * 1.15);

      setResult1([
        power,
        current,
        power / 0.98,
        0.98,
        circuitBreakerCurrent,
        wireCable,
      ]);

      // Олон амины сууцны тооцоо...
      const loadNominal = power * number;
      const powerHouses = loadNominal * coefAzk;
      const burenChadal = powerHouses / 0.98;

      const tpPower = threeCategory
        ? calcContext.ptbCalc(burenChadal, 1)
        : calcContext.ptbCalc(burenChadal, 2);

      setResult2([powerHouses, burenChadal, tpPower]);
    }

    await increase();
    setVisible(true);
  };

  return (
    <ScrollView style={css.container}>
      <Modal
        visible={visible}
        setVisible={setVisible}
        title="Тооцооны хариу"
        reset={reset}
      >
        <Text style={css.subtitle}>Өгөгдөл</Text>
        <Text
          style={{
            fontFamily: w500,
            fontSize: 16,
            color: gray,
            marginVertical: 5,
          }}
        >
          Нэг амины сууцны чадал, хотхон доторх сууцны тоо
        </Text>
        {(() => {
          const data = [
            {
              label: "Хотхон доторх сууцны тоо",
              unit: null,
            },
            {
              label: "1 амины сууцны суурилагдсан чадал",
              unit: "кВт",
            },
          ];
          return (
            <View>
              <View style={css.modalItem}>
                <Text
                  style={{
                    flexDirection: "row",
                    width: "90%",
                    flexWrap: "wrap",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: w400,
                      color: main,
                      marginRight: 5,
                      flexWrap: "wrap",
                    }}
                  >
                    {data[0].label}:{" "}
                  </Text>
                  {value && (
                    <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                      {value.number}
                    </Text>
                  )}
                </Text>
              </View>
              <View style={css.modalItem}>
                <Text
                  style={{
                    flexDirection: "row",
                    width: "90%",
                    flexWrap: "wrap",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: w400,
                      color: main,
                      marginRight: 5,
                      flexWrap: "wrap",
                    }}
                  >
                    {data[1].label}:{" "}
                  </Text>
                  {value && (
                    <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                      {value.load} {data[1].unit}
                    </Text>
                  )}
                </Text>
              </View>
            </View>
          );
        })()}
        <Text style={css.subtitle}>Үр дүн</Text>
        <Text
          style={{
            fontFamily: w500,
            fontSize: 16,
            color: gray,
            marginVertical: 5,
          }}
        >
          1 амины сууцны тооцооны үр дүн
        </Text>
        {(() => {
          const data = [
            {
              label: "Тооцооны чадал",
              unit: "кВт",
            },
            {
              label: "Тооцооны гүйдэл",
              unit: "А",
            },
            {
              label: "Бүрэн чадал, кВА",
              unit: "кВА",
            },
            {
              label: "Дундаж чадлын коэффициент",
              unit: null,
            },
            {
              label: "Автомат таслуурын гүйдэл",
              unit: "А",
            },
          ];
          return (
            <>
              {data.map(({ label, unit }, i) => {
                return (
                  <View key={i} style={css.modalItem}>
                    <Text
                      style={{
                        flexDirection: "row",
                        width: "90%",
                        flexWrap: "wrap",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: w400,
                          color: main,
                          marginRight: 5,
                          flexWrap: "wrap",
                        }}
                      >
                        {label}:{" "}
                      </Text>
                      {result1 && (
                        <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                          {result1[i] && Math.round(result1[i] * 1000) / 1000}{" "}
                          {unit}
                        </Text>
                      )}
                    </Text>
                  </View>
                );
              })}
              <View style={css.modalItem}>
                <Text
                  style={{
                    fontFamily: w400,
                    color: main,
                    marginRight: 5,
                    flexWrap: "wrap",
                  }}
                >
                  Кабель:
                </Text>
                {result1 && (
                  <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                    {value.cable === "AC1" ? cables[0].label : cables[1].label}{" "}
                    {result1[result1.length - 1]}
                  </Text>
                )}
              </View>
            </>
          );
        })()}
        <Text
          style={{
            fontFamily: w500,
            fontSize: 16,
            color: gray,
            marginVertical: 5,
          }}
        >
          {value.number} ширхэг сууцны тооцооны үр дүн
        </Text>
        {(() => {
          const data = [
            {
              label: "Тооцооны чадал",
              unit: "кВт",
            },
            {
              label: "Бүрэн чадал, кВА",
              unit: "кВА",
            },
          ];
          return (
            <>
              {data.map(({ label, unit }, i) => {
                return (
                  <View key={i} style={css.modalItem}>
                    <Text
                      style={{
                        fontFamily: w400,
                        color: main,
                        marginRight: 5,
                        flexWrap: "wrap",
                      }}
                    >
                      {label}:
                    </Text>
                    {result2 && (
                      <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                        {result2[i] && Math.round(result2[i] * 1000) / 1000}{" "}
                        {unit}
                      </Text>
                    )}
                  </View>
                );
              })}
              <View style={css.modalItem}>
                <Text
                  style={{
                    fontFamily: w400,
                    color: main,
                    marginRight: 5,
                    flexWrap: "wrap",
                  }}
                >
                  Дэд станц:
                </Text>
                {result2 && (
                  <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                    {result2[result2.length - 1]}
                  </Text>
                )}
              </View>
            </>
          );
        })()}
      </Modal>
      <FormSwitch
        icon="lightning-bolt"
        onValueChange={setThreeCategory}
        trueText="Бүх амины сууц III зэргийн хэрэглэгч"
        falseText="I,II зэргийн хэрэглэгчтэй"
        value={threeCategory}
        label="Барилгуудын ЦХНА-ны зэрэглэл"
      />
      <Textfield
        label="Сууцны тоог оруулна уу"
        placeholder="1-1000 хүртэл утга оруулна уу"
        icon="alpha-n"
        keyboardType="numeric"
        value={value.number ? value.number + "" : ""}
        onChangeText={(value) => valueChanger(value, "number", [1, 1000])}
        error={{
          text: "Та 1-1000 хүртэл тоон утга оруулна уу",
          show: err.number,
        }}
      />
      <Textfield
        label="Нэг амины сууцны суурилагдсан чадал, кВт"
        placeholder="1-100 хүртэл утга оруулна уу"
        icon="flash"
        keyboardType="numeric"
        value={value.load ? value.load + "" : ""}
        onChangeText={(value) => valueChangerButarhai(value, "load", [1, 100])}
        error={{
          text: "Та 1-100кВт хүртэл чадлын утга оруулна уу",
          show: err.load,
        }}
      />
      <FormPicker
        label="Кабелийн маяг"
        icon="google-circles-communities"
        options={cables}
        onValueChange={(value) => valueChanger(value, "cable")}
        value={value.cable ? value.cable : ""}
      />
      <Button disable={disable} onPress={calc}>
        Тооцоолох
      </Button>
    </ScrollView>
  );
};

export default HouseCalculatorScreen;

const css = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  title: {
    fontFamily: w500,
    textTransform: "uppercase",
    fontSize: 16,
    color: main,
    marginLeft: 7,
    alignSelf: "center",
    paddingHorizontal: 3,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: w500,
    textTransform: "uppercase",
    fontSize: 16,
    color: dark,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: light,
    marginVertical: 3,
    padding: 7,
    borderRadius: 5,
  },
});
