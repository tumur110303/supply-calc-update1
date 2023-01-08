import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import FormPicker from "../../../components/FormPicker";
import Textfield from "../../../components/Textfield";
import { dark, light, main, w400, w500 } from "../../../constants";
import Button from "../../../components/Button";
import CalcContext from "../../../context/CalcContext";
import Modal from "../../../components/ResultModal";
import CountContext from "../../../context/CountContext";

const SmallCalculatorScreen = () => {
  // ####################################  VARIABLES ####################################
  const calcContext = useContext(CalcContext);
  const { increase } = useContext(CountContext);

  // Input буюу гараас авах утга...
  const [capacity, setCapacity] = useState<number>();

  // Туслах...
  const [error, setError] = useState<boolean>(false);
  const [index, setIndex] = useState<string>("0");
  const [visible, setVisible] = useState<boolean>(false);

  // Cable type...
  const [sectionCable, setSectionCable] = useState<string | undefined>("");
  const [cableType, setCableType] = useState<string>("AC1");
  const cables = [
    { label: "АВБбШв", value: "AC1" },
    { label: "АВВГ", value: "AC2" },
    { label: "ВВГ", value: "CC1" },
    { label: "КГ", value: "CC2" },
  ];

  // options...
  const [value, setValue] = useState([
    {
      privLoad: 1.04, // 0
      pf: 0.98,
      unit: "суудлын тоо",
      err: [1, 400],
    },
    {
      privLoad: 0.86, //1
      pf: 0.98,
      unit: "суудлын тоо",
      err: [400, 1000],
    },
    {
      privLoad: 0.75, //2
      pf: 0.98,
      unit: "суудлын тоо",
      err: [1000, 2000],
    },
    {
      privLoad: 0.81, //3
      pf: 0.95,
      unit: "суудлын тоо",
      err: [1, 400],
    },
    {
      privLoad: 0.69, //4
      pf: 0.95,
      unit: "суудлын тоо",
      err: [400, 1000],
    },
    {
      privLoad: 0.56, //5
      pf: 0.95,
      unit: "суудлын тоо",
      err: [1000, 2000],
    },
    {
      privLoad: 0.25, //6
      pf: 0.85,
      unit: "талбайн (м2) тоо",
      err: [1, 5000],
    },
    {
      privLoad: 0.23, //7
      pf: 0.85,
      unit: "талбайн (м2) тоо",
      err: [1, 5000],
    },
    {
      privLoad: 0.16, //8
      pf: 0.85,
      unit: "талбайн (м2) тоо",
      err: [1, 5000],
    },
    {
      privLoad: 0.14, //9
      pf: 0.85,
      unit: "талбайн (м2) тоо",
      err: [1, 5000],
    },
    {
      privLoad: 0.25, //10
      pf: 0.95,
      unit: "сурагчийн тоо",
      err: [1, 1500],
    },
    {
      privLoad: 0.17, // 11
      pf: 0.9,
      unit: "сурагчийн тоо",
      err: [1, 1500],
    },
    {
      privLoad: 0.17, //12
      pf: 0.9,
      unit: "сурагчийн тоо",
      err: [1, 1500],
    },
    {
      privLoad: 0.15, //13
      pf: 0.9,
      unit: "сурагчийн тоо",
      err: [1, 1500],
    },
    {
      privLoad: 0.46, //14
      pf: 0.9,
      unit: "сурагчийн тоо",
      err: [1, 1500],
    },
    {
      privLoad: 0.46, //15
      pf: 0.98,
      unit: "хүүхдийн тоо",
      err: [1, 1000],
    },
    {
      privLoad: 0.12, // 16
      pf: 0.85,
      unit: "суудлын тоо",
      err: [1, 2000],
    },
    {
      privLoad: 0.14, //17
      pf: 0.85,
      unit: "суудлын тоо",
      err: [1, 2000],
    },
    {
      privLoad: 0.46, //18
      pf: 0.85,
      unit: "суудлын тоо",
      err: [1, 2000],
    },
    {
      privLoad: 0.054, //19
      pf: 0.85,
      unit: "талбайн (м2) тоо",
      err: [1, 5000],
    },
    {
      privLoad: 0.043, //20
      pf: 0.85,
      unit: "талбайн (м2) тоо",
      err: [1, 5000],
    },
    {
      privLoad: 0.46, // 21
      pf: 0.9,
      unit: "орны тоо",
      err: [1, 500],
    },
    {
      privLoad: 0.34, //22
      pf: 0.9,
      unit: "орны тоо",
      err: [1, 500],
    },
    {
      privLoad: 0.36, //23
      pf: 0.9,
      unit: "орны тоо",
      err: [1, 2000],
    },
    {
      privLoad: 0.023, //24
      pf: 0.9,
      unit: "хүүхдийн тоо",
      err: [1, 5000],
    },
    {
      privLoad: 0.075, //25
      pf: 0.9,
      unit: "жин (кг)-",
      err: [1, 200],
    },
    {
      privLoad: 15, //26
      pf: 0.97,
      unit: "ажлын байрны тоо",
      err: [1, 20],
    },
    {
      privLoad: 2.5, //27
      pf: 0.92,
      unit: "орны тоо",
      err: [1, 1000],
    },
    {
      privLoad: 0.7, //28
      pf: 0.95,
      unit: "орны тоо",
      err: [1, 1000],
    },
    {
      privLoad: 0.45, //29
      pf: 0.95,
      unit: "орны тоо",
      err: [1, 1000],
    },
    {
      privLoad: 2, //30
      pf: 0.93,
      unit: "орны тоо",
      err: [1, 1000],
    },
    {
      privLoad: 0.15, //31
      pf: 0.92,
      unit: "1 ээлжинд үзэх хүний тоо",
      err: [1, 50],
    },
    {
      privLoad: 0.15, //32
      pf: 0.9,
      unit: "талбайн (м2) тоо",
      err: [1, 2000],
    },
    {
      privLoad: 0.1, //33
      pf: 0.93,
      unit: "талбайн (м2) тоо",
      err: [1, 2000],
    },
  ]);

  const buildingType = [
    {
      label: "400 хүртэл суудалтай хоолны газар (100%)",
      value: 0,
    },
    {
      label: "400-1000 суудалтай хоолны газар (100%)",
      value: 1,
    },
    {
      label: "1000-c дээш суудалтай хоолны газар (100%)",
      value: 2,
    },
    {
      label: "400 хүртэл суудалтай хоолны газар (хэсэгчилсэн)",
      value: 3,
    },
    {
      label: "400-1000 суудалтай хоолны газар (хэсэгчилсэн)",
      value: 4,
    },
    {
      label: "1000-c дээш суудалтай хоолны газар (хэсэгчилсэн)",
      value: 5,
    },
    {
      label: "Condition-той хүнсний дэлгүүр",
      value: 6,
    },
    {
      label: "Condition-гүй хүнсний дэлгүүр",
      value: 7,
    },
    {
      label: "Condition-той барааны дэлгүүр",
      value: 8,
    },
    {
      label: "Condition-гүй барааны дэлгүүр",
      value: 9,
    },
    {
      label: "Хоолны газар ба спорт заалтай ЕБС",
      value: 10,
    },
    {
      label: "Зөвхөн спорт заалтай ЕБС",
      value: 11,
    },
    {
      label: "Буфеттэй ЕБС",
      value: 12,
    },
    {
      label: "Буфетгүй ЕБС",
      value: 13,
    },
    {
      label: "МСҮТ",
      value: 14,
    },
    {
      label: "Хүүхдийн цэцэрлэг, ясли",
      value: 15,
    },
    {
      label: "Condition-той кино театр, концертийн танхим",
      value: 16,
    },
    {
      label: "Condition-гүй кино театр, концертийн танхим",
      value: 17,
    },
    {
      label: "Клуб",
      value: 18,
    },
    {
      label:
        "Condition-той захиргаа, санхүү, зураг төсөл, зохион бүтээх, улсын даатгалын газар",
      value: 19,
    },
    {
      label:
        "Condition-гүй захиргаа, санхүү, зураг төсөл, зохион бүтээх, улсын даатгалын ",
      value: 20,
    },
    {
      label: "Condition-той зочид буудал",
      value: 21,
    },
    {
      label: "Condition-гүй зочид буудал",
      value: 22,
    },
    {
      label: "Амралт, сувилал, асрамжийн газар",
      value: 23,
    },
    {
      label: "Хүүхдийн зуслан",
      value: 24,
    },
    {
      label: "Хими цэвэрлэгээ, угаалга",
      value: 25,
    },
    {
      label: "Үсчин гоо сайхан",
      value: 26,
    },
    {
      label: "Хоол бэлтгэдэг мэс заслын эмнэлэг",
      value: 27,
    },
    {
      label: "Хоол бэлтгэдэггүй мэс заслын эмнэлэг",
      value: 28,
    },
    {
      label: "Гэмтлийн эмнэлэг",
      value: 29,
    },
    {
      label: "Хоол бэлтгэх хүүхдийн",
      value: 30,
    },
    {
      label: "Поликлиник",
      value: 31,
    },
    {
      label: "Эм бэлтгэдэг эмийн сан",
      value: 32,
    },
    {
      label: "Эм бэлтгэдэггүй эмийн сан",
      value: 33,
    },
  ];

  // Сүүлийн хариу буюу үр дүн...
  const [result, setResult] = useState<any>({});

  // ########################### FORM-ТОЙ АЖИЛЛАХ ФУНКЦ ##################################
  const valueChanger = (text: string) => {
    // Error шалгах хэсэг...
    const utga = parseInt(text);
    let i = 0;
    index ? (i = parseInt(index)) : (i = 0);

    setError((err: boolean) => {
      err = utga < value[i].err[0] || utga > value[i].err[1];
      return err;
    });

    // Утга өөрлчөх хэсэг...
    if (text !== "") {
      const number = parseInt(text);

      setCapacity((text) => (text = number));
    } else {
      setCapacity((text) => (text = 0));
    }
  };

  // ################################# ТООЦООЛОХ ФУНКЦ ###################################
  const calc = async () => {
    const capaNum = capacity ? capacity : 0;
    const huwiinChadal = value[parseInt(index)].privLoad;
    const pf = value[parseInt(index)].pf;
    const chadal = huwiinChadal * capaNum;
    const hurtver = chadal * 1000;
    const sqrtThree = Math.sqrt(3);
    const huwaari = sqrtThree * 380 * pf;
    const guidel = hurtver / huwaari;
    const burenChadal = chadal / pf;

    const hariu = calcContext?.wireCircuitBreakerThreePhase(
      cableType,
      guidel * 1.15
    );

    if (
      hariu?.wireCable ==
      "Хүчдэлийн утга болон халалтын нөхцлийн аль нэг шаардлага хангагдахгүй байна! Та өгөгдлөө шалгана уу!"
    ) {
      hariu.wireCable =
        "Ачааллыг хувааж 2 ба түүнээс дээш кабелиар дамжуулах шаардлагатай.";
    }

    const { circuitBreakerCurrent, wireCable } = { ...hariu };

    setResult([chadal, guidel, burenChadal, pf, circuitBreakerCurrent]);
    setSectionCable(wireCable);

    console.log(result, sectionCable);

    await increase();
    setVisible(true);
  };

  const reset = () => {
    setIndex("0");
    setCableType("AC1");
    setCapacity(0);
    setVisible(false);
  };
  // ################################### ХАРУУЛАХ ХЭСЭГ ##################################
  return (
    <ScrollView style={css.container}>
      <Modal
        visible={visible}
        setVisible={setVisible}
        title="Тооцооны хариу"
        reset={reset}
      >
        <Text style={css.subtitle}>Өгөгдөл</Text>
        {(() => {
          const data = [
            {
              label: "Барилгын төрөл",
              value: buildingType[parseInt(index)].label,
              unit: null,
            },
            {
              label: "Хүчин чадал",
              value: capacity,
              unit: `(${value[parseInt(index)].unit})`,
            },
          ];
          return (
            <>
              {data
                .filter((item) => item.value !== undefined)
                .map(({ label, value, unit }, i) => (
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
                      <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                        {value} {unit}
                      </Text>
                    </Text>
                  </View>
                ))}
            </>
          );
        })()}
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
            {
              label: "Автомат таслуурын гүйдэл",
              unit: "A",
            },
            {
              label: "Кабель",
              value: `${
                cables.find((item) => item.value === cableType)?.label
              } ${sectionCable}`,
            },
          ];
          return (
            <>
              {data.map(({ label, unit, value }, i) => {
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
                      {value && (
                        <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                          {value}
                        </Text>
                      )}
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
            </>
          );
        })()}
      </Modal>

      <FormPicker
        label="Барилгын төрөл"
        icon="blur"
        options={buildingType}
        onValueChange={(value) => {
          setIndex(value);
        }}
        value={index}
      />

      <Textfield
        label="Барилгын хүчин чадал"
        keyboardType="numeric"
        placeholder={`${value[parseInt(index)].err[0]}-${
          value[parseInt(index)].err[1]
        }-н хооронд ${value[parseInt(index)].unit}г оруулна уу`}
        error={{
          text: "Та тохирох утга оруулна уу",
          show: error,
        }}
        onChangeText={(value) => valueChanger(value)}
        value={capacity ? capacity + "" : ""}
      />
      <FormPicker
        label="Кабелийн маяг"
        icon="google-circles-communities"
        options={cables}
        onValueChange={(value) => setCableType(value)}
        value={cableType}
      />
      <Button disable={error || !capacity} onPress={calc}>
        Тооцоолох
      </Button>
    </ScrollView>
  );
};

export default SmallCalculatorScreen;

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
