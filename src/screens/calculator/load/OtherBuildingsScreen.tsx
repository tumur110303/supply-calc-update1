import { StyleSheet, Text, ScrollView, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { dark, gray, light, main, w400, w500 } from "../../../constants";
import PickerInputTwo from "../../../components/nomany/PickerInputTwo";
import FormPicker from "../../../components/FormPicker";
import Button from "../../../components/Button";
import FormSwitch from "../../../components/FormSwitch";
import CalcContext from "../../../context/CalcContext";
import Modal from "../../../components/ResultModal";
import CountContext from "../../../context/CountContext";

type Error = {
  one?: boolean;
  two?: boolean;
  three?: boolean;
  four?: boolean;
  five?: boolean;
  six?: boolean;
  seven?: boolean;
  eight?: boolean;
  nine?: boolean;
  ten?: boolean;
};

const OtherBuildingsScreen = () => {
  const calcContext = useContext(CalcContext);
  const { increase } = useContext(CountContext);
  // Үндсэн өгөгдөл...
  const [loadBuilding, setLoadBuilding] = useState<any>([]);
  const [powerFactor, setPowerFactor] = useState<number[]>([
    0.98, 0.96, 0.98, 0.98, 0.95, 0.9, 0.85, 0.85, 0.85, 0.9, 0.92, 0.85, 0.92,
    0.98,
  ]);

  // Эцсийн үр дүн...
  const [result, setResult] = useState<any>([]);

  // Туслах өгөгдөл...
  const [threeCategory, setThreeCategory] = useState<boolean>(false);
  const [buildingNumber, setBuildingNumber] = useState<string>("1");
  const [buildingType, setBuildingType] = useState<string[]>([
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ]);
  const [visible, setVisible] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const [err, setErr] = useState<Error>({});

  // Таблица ...
  const one = [
    1, 0.9, 0.6, 0.7, 0.6, 0.4, 0.6, 0.8, 0.6, 0.7, 0.7, 0.6, 0.9, 0.4,
  ];
  const two = [
    0.9, 1, 0.6, 0.7, 0.5, 0.3, 0.5, 0.8, 0.4, 0.7, 0.6, 0.5, 0.9, 0.4,
  ];
  const threeFour = [
    0.4, 0.4, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.7, 0.8, 0.8, 0.5, 0.8,
  ];
  const fiveSixFourteen = [
    0.5, 0.4, 0.8, 0.6, 0.7, 0.7, 0.8, 0.8, 0.8, 0.7, 0.8, 0.7, 0.8, 0.8,
  ];
  const sevenEight = [
    0.5, 0.4, 0.8, 0.6, 0.7, 0.7, 0.8, 0.8, 0.8, 0.7, 0.8, 0.7, 0.8, 0.8,
  ];
  const nine = [
    0.5, 0.4, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.7, 0.8, 0.8, 0.7, 0.5, 0.8,
  ];
  const ten = [
    0.8, 0.8, 0.6, 0.8, 0.4, 0.3, 0.6, 0.8, 0.6, 0.8, 0.7, 0.5, 0.9, 0.4,
  ];
  const eleven = [
    0.5, 0.4, 0.8, 0.6, 0.6, 0.8, 0.8, 0.8, 0.8, 0.7, 0.8, 0.7, 0.8, 0.8,
  ];
  const twelve = [
    0.5, 0.4, 0.8, 0.6, 0.8, 0.8, 0.8, 0.8, 0.8, 0.7, 0.8, 0.7, 0.8, 0.8,
  ];
  const thirteen = [
    0.9, 0.9, 0.4, 0.6, 0.3, 0.2, 0.2, 0.8, 0.2, 0.7, 0.4, 0.4, 1, 0.2,
  ];

  // барилгын тоог гараас өгөх options...
  const buildingNumberOption = [
    { label: "Нэг барилга тэжээх дэд станц", value: "1" },
    { label: "Хоёр барилга тэжээх дэд станц", value: "2" },
    { label: "Гурван барилга тэжээх дэд станц", value: "3" },
    { label: "Дөрвөн барилга тэжээх дэд станц", value: "4" },
    { label: "Таван барилга тэжээх дэд станц", value: "5" },
    { label: "Зургаан барилга тэжээх дэд станц", value: "6" },
    { label: "Долоон барилга тэжээх дэд станц", value: "7" },
    { label: "Найман барилга тэжээх дэд станц", value: "8" },
    { label: "Есөн барилга тэжээх дэд станц", value: "9" },
    { label: "Арван барилга тэжээх дэд станц", value: "10" },
  ];

  //   Барилгын төрөл options...
  const buildingTypeOptions = [
    { label: "Цахилгаан зуухтай сууц", value: "0" },
    { label: "Түлшний зуухтай сууц", value: "1" },
    { label: "Цайны газар", value: "2" },
    { label: "Ресторан, кафе", value: "3" },
    { label: "ЕБС", value: "4" },
    { label: "МСҮТ, номын сан", value: "5" },
    { label: "1 ээлжийн худалдаа, үйлчилгээ", value: "6" },
    { label: "2 ээлжийн худалдаа, үйлчилгээ", value: "7" },
    { label: "Захригаа, санхүү, зураг төсөл", value: "8" },
    { label: "Зочид буудал", value: "9" },
    { label: "Эмнэлэг", value: "10" },
    { label: "Ахуйн үйлчилгээ", value: "11" },
    { label: "Кино театр, клуб, дуурийн театр", value: "12" },
    { label: "Хүүхдийн цэцэрлэг, ясли", value: "13" },
  ];

  //   ############################## ГОЛ ТООЦООЛОХ ФУНКЦ ###############################
  const calc = async () => {
    const achaaArr = [...loadBuilding];

    const maxAchaaTodorhoiloh = (arr: any) => {
      const arrNum: number[] = arr.map((el: string) => parseFloat(el));
      const maxAchaa = arrNum.reduce((max: number, el: number) =>
        max > el ? max : el
      );
      const index = arrNum.findIndex((el) => el === maxAchaa);

      return { maxAchaa, index };
    };

    const { maxAchaa, index } = maxAchaaTodorhoiloh(achaaArr);
    const tableNumberMax = parseInt(buildingType[index]);
    let coeffTable: number[] = [];

    // Таблицаа сонгох хэсэг...
    if (tableNumberMax === 0) {
      coeffTable = [...one];
    } else if (tableNumberMax === 1) {
      coeffTable = [...two];
    } else if (tableNumberMax === 2 || tableNumberMax === 3) {
      coeffTable = [...threeFour];
    } else if (
      tableNumberMax === 4 ||
      tableNumberMax === 5 ||
      tableNumberMax === 13
    ) {
      coeffTable = [...fiveSixFourteen];
    } else if (tableNumberMax === 6 || tableNumberMax === 7) {
      coeffTable = [...sevenEight];
    } else if (tableNumberMax === 8) {
      coeffTable = [...nine];
    } else if (tableNumberMax === 9) {
      coeffTable = [...ten];
    } else if (tableNumberMax === 10) {
      coeffTable = [...eleven];
    } else if (tableNumberMax === 11) {
      coeffTable = [...twelve];
    } else if (tableNumberMax === 12) {
      coeffTable = [...thirteen];
    }

    // АЗКоэффициентийн таблицаас салгаж зөвхөн хэрэгтэйгээ салгаж массивт хийх...
    const coeffArray = buildingType.map((el: string, i: number) => {
      return coeffTable[parseInt(el)];
    });
    // Cosф ялгаж авах...
    const pfArr = buildingType.map((el: string, i: number) => {
      return powerFactor[parseInt(el)];
    });

    const hurtwerArr = achaaArr.map((el: number, i) => el * pfArr[i]);
    const hurtwer = hurtwerArr.reduce((a: number, b: number) => a + b, 0);
    const huwaari = achaaArr.reduce(
      (a: number, b: number) => Math.abs(a) + Math.abs(b),
      0
    );

    // Дундаж Cosф...
    console.log("cosф", pfArr);
    const pf = hurtwer / huwaari;

    // Ачааг АЗК-р үржүүлж олох функц...
    let tootsooniiAchaaArr = achaaArr.map(
      (el: number, i: number) => el * coeffArray[i]
    );

    // Массиваас хамгийн их ачааг хаслаа...
    tootsooniiAchaaArr.splice(index, 1);
    // console.log("Шууд нэмэгдэх ачаанууд /хассан/ ", tootsooniiAchaaArr);

    const turAchaaArrNiilber = tootsooniiAchaaArr.reduce(
      (a: number, b: number) => a + b,
      0
    );

    // console.log("A3K ", coeffArray, " Cosф : ", pfArr);

    // ХАМГИЙН СҮҮЛЧИЙН ТООЦООНЫ АЧАА...
    const achaalalSuulch = turAchaaArrNiilber + maxAchaa;
    const burenChadal = achaalalSuulch / pf;
    const threeSqrt = Math.sqrt(3);
    const huwaariCurrent = threeSqrt * 380 * pf;
    const current = (achaalalSuulch * 1000) / huwaariCurrent;

    const tpPower = threeCategory
      ? calcContext?.ptbCalc(burenChadal, 1)
      : calcContext?.ptbCalc(burenChadal, 2);

    setResult([achaalalSuulch, current, burenChadal, pf, tpPower]);

    await increase();
    setVisible(true);
  };

  const reset = () => {
    setBuildingNumber("1");
    setLoadBuilding([]);
    setVisible(false);
  };

  //   ########################### FORM-ТОЙ АЖИЛЛАХ ФУНКЦ ###########################
  const valueChanger = (
    text: string,
    index: number,
    key: string,
    validation?: [number, number]
  ) => {
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

      setLoadBuilding(() => {
        const copy = [...loadBuilding];
        copy[index] = number;
        return copy;
      });
    } else {
      setLoadBuilding(() => {
        const copy = [...loadBuilding];
        copy[index] = "";
        return copy;
      });
    }
  };

  const buildingTypeChanger = (value: string, index: number) => {
    // Утга өөрлчөх хэсэг...
    if (value) {
      const number = value;

      setBuildingType(() => {
        const copy = [...buildingType];
        copy[index] = number;
        return copy;
      });
    } else {
      setBuildingType(() => {
        const copy = [...buildingType];
        copy[index] = "";
        return copy;
      });
    }
  };

  // Button идэвхгүй болгох эсэхийг шийдэх функц...
  const disableCheck = () => {
    const errors = !Object.values(err).every((err) => err === false);

    if (!errors) {
      setDisable(false);
    }

    setDisable(() => {
      if (buildingNumber == "2") return !loadBuilding[0] || !loadBuilding[1];

      if (buildingNumber == "3")
        return !loadBuilding[0] || !loadBuilding[1] || !loadBuilding[2];

      if (buildingNumber == "4")
        return (
          !loadBuilding[0] ||
          !loadBuilding[1] ||
          !loadBuilding[2] ||
          !loadBuilding[3]
        );

      if (buildingNumber == "5")
        return (
          !loadBuilding[0] ||
          !loadBuilding[1] ||
          !loadBuilding[2] ||
          !loadBuilding[3] ||
          !loadBuilding[4]
        );

      if (buildingNumber == "6")
        return (
          !loadBuilding[0] ||
          !loadBuilding[1] ||
          !loadBuilding[2] ||
          !loadBuilding[3] ||
          !loadBuilding[4] ||
          !loadBuilding[5]
        );

      if (buildingNumber == "7")
        return (
          !loadBuilding[0] ||
          !loadBuilding[1] ||
          !loadBuilding[2] ||
          !loadBuilding[3] ||
          !loadBuilding[4] ||
          !loadBuilding[5] ||
          !loadBuilding[6]
        );

      if (buildingNumber == "8")
        return (
          !loadBuilding[0] ||
          !loadBuilding[1] ||
          !loadBuilding[2] ||
          !loadBuilding[3] ||
          !loadBuilding[4] ||
          !loadBuilding[5] ||
          !loadBuilding[6] ||
          !loadBuilding[7]
        );

      if (buildingNumber == "9")
        return (
          !loadBuilding[0] ||
          !loadBuilding[1] ||
          !loadBuilding[2] ||
          !loadBuilding[3] ||
          !loadBuilding[4] ||
          !loadBuilding[5] ||
          !loadBuilding[6] ||
          !loadBuilding[7] ||
          !loadBuilding[8]
        );

      if (buildingNumber == "10")
        return (
          !loadBuilding[0] ||
          !loadBuilding[1] ||
          !loadBuilding[2] ||
          !loadBuilding[3] ||
          !loadBuilding[4] ||
          !loadBuilding[5] ||
          !loadBuilding[6] ||
          !loadBuilding[7] ||
          !loadBuilding[8] ||
          !loadBuilding[9]
        );

      return !loadBuilding[0];
    });

    if (errors) {
      setDisable(true);
    }
  };

  useEffect(() => {
    disableCheck();
  }, [loadBuilding, buildingNumber, err]);

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
          Барилгын зориулалт, тооцооны чадал
        </Text>
        {[...Array(parseInt(buildingNumber))].map((el, i) => {
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
                  }}
                >
                  {buildingTypeOptions[parseInt(buildingType[i])].label}:{" "}
                </Text>
                <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                  {loadBuilding[i]} кВт
                </Text>
              </Text>
            </View>
          );
        })}
        <Text style={css.subtitle}>Үр дүн</Text>
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
                      {result && (
                        <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                          {result[i] && Math.round(result[i] * 1000) / 1000}{" "}
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
                  Дэд станц:
                </Text>
                {result && (
                  <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                    {result[result.length - 1]}
                  </Text>
                )}
              </View>
            </>
          );
        })()}
      </Modal>
      <FormPicker
        label="Барилгын тоо"
        icon="blur"
        options={buildingNumberOption}
        onValueChange={(value) => {
          setBuildingNumber(value);
        }}
        value={buildingNumber}
        style={{ marginBottom: 10 }}
      />
      <FormSwitch
        icon="lightning-bolt"
        onValueChange={setThreeCategory}
        trueText="Бүх барилга III зэргийн хэрэглэгч"
        falseText="I,II зэргийн хэрэглэгчтэй"
        value={threeCategory}
        label="Барилгуудын ЦХНА-ны зэрэглэл"
      />
      {[...Array(parseInt(buildingNumber))].map((el, i) => {
        let index = i + 1;
        let branch:
          | "one"
          | "two"
          | "three"
          | "four"
          | "five"
          | "six"
          | "seven"
          | "eight"
          | "nine"
          | "ten" = "one";
        if (i === 0) branch = "one";
        else if (i === 1) branch = "two";
        else if (i === 2) branch = "three";
        else if (i === 3) branch = "four";
        else if (i === 4) branch = "five";
        else if (i === 5) branch = "six";
        else if (i === 6) branch = "seven";
        else if (i === 7) branch = "eight";
        else if (i === 8) branch = "nine";
        else if (i === 9) branch = "ten";
        const errKeyArr = [
          "one",
          "two",
          "three",
          "four",
          "five",
          "six",
          "seven",
          "eight",
          "nine",
          "ten",
        ];
        return (
          <PickerInputTwo
            label={`${index}-р барилгын зориулалт, тооцооны чадал`}
            key={i}
            keyboardType="numeric"
            placeholder={"Чадал, кВт"}
            value={[loadBuilding[i], buildingType[i]]}
            style={{ marginBottom: 10 }}
            options={buildingTypeOptions}
            onChangeText={(value) =>
              valueChanger(value, i, errKeyArr[i], [10, 1000])
            }
            checkChangeValue={(value) => buildingTypeChanger(value, i)}
            error={{
              show: err[branch],
              text: "Та 10-1000кВт хүртэл утга оруулна уу",
            }}
          />
        );
      })}
      <Button disable={disable} onPress={calc}>
        Тооцоолох
      </Button>
    </ScrollView>
  );
};

export default OtherBuildingsScreen;

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
