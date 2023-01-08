import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import FormPicker from "../../../components/FormPicker";
import CalcContext from "../../../context/CalcContext";
import MyButton from "../../../components/Button";
import { dark, light, main, w400, w500 } from "../../../constants";
import Textfield from "../../../components/Textfield";
import ResultModal from "../../../components/ResultModal";

const PrivatePowerScreen = () => {
  type Value = {
    area?: string;
  };

  type Error = {
    area?: boolean;
  };

  const calcContext = useContext(CalcContext);
  // ##############################   ХУВЬСАГЧУУД   #########################################
  const [value, setValue] = useState<Value>({});
  const [error, setError] = useState<Error>({});
  const [type, setType] = useState<string>("Люминесцент");

  // Туслах өгөгдлүүд...
  const [roomType, setRoomType] = useState<string>("0");
  const [lightType, setLightType] = useState<string>("0");
  const [height, setHeight] = useState<string>("0");
  const [powerLight, setPowerLight] = useState<string>("18");

  const [visible, setVisible] = useState<boolean>(false);
  const [result, setResult] = useState<number>();

  // ###################################  OPTIONS AND TABLES ################################
  // Өрөө тасалгааны өгөгдлүүдийн options...
  const roomTypesOptions = [
    { label: "Механик цех", value: "0" },
    { label: "Төмрийн цех", value: "1" },
    { label: "Бэлтгэл цех", value: "2" },
    { label: "Гагнуурын цех", value: "3" },
    { label: "Металл өнгөлгөөний хэсэг", value: "4" },
    { label: "Аппарат хэрэгслийн засварын цех", value: "5" },
    { label: "Трансформаторын засварын хэсэг", value: "6" },
    { label: "Цахилгаан засварын хэсэг", value: "7" },
    { label: "Хатаалгын цех", value: "8" },
    { label: "Мод боловсруулах цех", value: "9" },
    { label: "Будгийн цех", value: "10" },
    { label: "Химийн лаборатори", value: "11" },
    { label: "Засвар үйлчилгээний газар", value: "12" },
    { label: "Автомашины дулаан зогсоол", value: "13" },
    { label: "Түлшний аппарат, засвар", value: "14" },
    { label: "Акумуляторын өрөө", value: "15" },
    { label: "Хүчилтөрөгчийн өрөө", value: "16" },
    { label: "Цавууны цех", value: "17" },
    { label: "Зуухан цех", value: "18" },
    { label: "Салхивчийн өрөө", value: "19" },
    { label: "Хими, ус цэвэрлэгээний өрөө", value: "20" },
    { label: "Түлш дамжуулах өрөө", value: "21" },
    { label: "Жижүүртэй цахилгааны самбарын өрөө", value: "22" },
    { label: "Диспетчерийн өрөө", value: "23" },
    { label: "Трансформаторын өрөө", value: "24" },
    { label: "Дэд станцын хуваарилах байгууламжийн өрөө", value: "25" },
    { label: "Сантехникийн узелийн өрөө", value: "26" },
  ];
  const lightTypesOptions = [
    { label: "Люминесцент чийдэнтэй", value: "0" },
    { label: "Улайсах чийдэнтэй", value: "1" },
  ];
  const heightOptions = [
    { label: "2-3м", value: "0" },
    { label: "3-4м", value: "1" },
  ];
  const powerLightOptions = [
    [
      { label: "18Вт", value: "18" },
      { label: "36Вт", value: "36" },
      { label: "72Вт", value: "72" },
    ],
    [
      { label: "30Вт", value: "30" },
      { label: "60Вт", value: "60" },
      { label: "100Вт", value: "100" },
      { label: "200Вт", value: "200" },
    ],
  ];

  // Таблицууд...
  const privatePowerTable = [
    [
      [
        { area: [0, 15], value: 10.1 },
        { area: [15, 25], value: 8.5 },
        { area: [25, 50], value: 7 },
        { area: [50, 150], value: 5.7 },
        { area: [150, 300], value: 5.1 },
        { area: [300, 1000], value: 4.5 },
      ],
      [
        { area: [0, 15], value: 14.4 },
        { area: [15, 20], value: 11.4 },
        { area: [20, 30], value: 9.9 },
        { area: [30, 50], value: 8.3 },
        { area: [50, 120], value: 6.8 },
        { area: [120, 300], value: 5.6 },
        { area: [300, 1000], value: 4.5 },
      ],
    ],
    [
      [
        { area: [0, 15], value: 48 },
        { area: [15, 25], value: 39 },
        { area: [25, 50], value: 31 },
        { area: [50, 150], value: 26 },
        { area: [150, 300], value: 22 },
        { area: [300, 1000], value: 19 },
      ],
      [
        { area: [0, 15], value: 55.7 },
        { area: [15, 20], value: 46.3 },
        { area: [20, 30], value: 37.7 },
        { area: [30, 50], value: 29.8 },
        { area: [50, 120], value: 25.8 },
        { area: [120, 300], value: 21.4 },
        { area: [300, 1000], value: 18.3 },
      ],
    ],
  ];

  const normalLuminosityTab = [
    [
      300, 200, 150, 200, 200, 300, 200, 300, 100, 200, 300, 300, 200, 50, 300,
      75, 75, 100, 75, 75, 75, 75, 150, 200, 75, 100, 75,
    ],
    [
      150, 150, 100, 150, 150, 100, 150, 200, 50, 150, 200, 150, 150, 20, 200,
      30, 30, 50, 30, 30, 30, 30, 100, 150, 30, 75, 20,
    ],
  ];

  // ############################# FORM-ТОЙ АЖИЛЛАХ ФУНКЦ  ################################
  const valueChanger = (
    text: string,
    id: keyof Value | [keyof Value],
    validation?: [number, number]
  ) => {
    const key = typeof id === "object" ? id[0] : id;
    if (text !== "") {
      if (validation) {
        if (
          parseFloat(text) < validation[0] ||
          validation[1] < parseFloat(text)
        ) {
          setError((state) => {
            state[key] = true;
            return state;
          });
        } else {
          setError((state) => {
            state[key] = false;
            return state;
          });
        }
      } else {
        setError((state) => {
          state[key] = false;
          return state;
        });
      }

      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = text;

        return copy;
      });
    } else {
      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = undefined;

        return copy;
      });
    }
  };

  // ################################# АНХААРУУЛГА  #########################################
  useEffect(() => {
    Alert.alert(
      "Анхаар!",
      "Хувийн чадлын аргаар тооцоог хийхэд люминесцент чийдэнтэй ЛБ40 маягийн 36-40Вт чадалтай нэг чийдэнтэй болон улайсах чийдэнтэй 60-100Вт чадалтай нэг гэрлийн шилтэй гэрэлтүүлэгчийн хувьд тооцоог хийж гүйцэтгэнэ. Мөн хана, тааз, шалны ойлтыг 50%, 30%, 10%-аар тооцсон. ",
      [
        {
          text: "Ойлгосон",
          onPress: () => {},
          style: "cancel",
        },
      ]
    );
  }, []);

  // ################################ ГОЛ ТООЦООЛОХ ФУНКЦ ##################################
  const calc = () => {
    const area = value.area ? parseFloat(value.area) : 0;
    const lightPower = parseInt(powerLight);

    const tablePrivatePower =
      privatePowerTable[parseInt(lightType)][parseInt(height)];

    const huviinChadalIndex = (arr: { area: number[]; value: number }[]) => {
      for (const e of arr) {
        if (e.area[0] < area && e.area[1] >= area) return e.value;
        else if (e.area[1] < area) continue;

        return 10.1;
      }
    };

    // Хувийн чадал...
    const privatePower = huviinChadalIndex(tablePrivatePower);

    const normalLuminosity =
      normalLuminosityTab[parseInt(lightType)][parseInt(roomType)];

    const privatePowerCalc = privatePower
      ? (normalLuminosity * privatePower) / 100
      : 10.1;

    const power = area * privatePowerCalc;
    const number = power / lightPower;

    setResult(Math.ceil(number));
    setVisible(true);
  };

  useEffect(() => {
    if (lightType === "0") setType("Люминесцент");
    else if (lightType === "1") setType("Улайсах");
  }, [lightType]);

  const reset = () => {
    setValue({});
    setResult(0);
    setRoomType("0");
    setLightType("0");
    setPowerLight("18");
    setVisible(false);
  };

  return (
    <ScrollView style={css.container}>
      <ResultModal
        visible={visible}
        setVisible={setVisible}
        title="Тооцооны хариу"
        reset={reset}
      >
        <Text style={css.subtitle}>Өгөгдөл</Text>
        {(() => {
          const data = [
            {
              label: "Өрөөний зориулалт",
              value: roomTypesOptions[parseInt(roomType)].label,
              unit: null,
            },
            {
              label: "Гэрлийн үүсгүүр",
              value: type,
              unit: null,
            },
            {
              label: "Өрөөний шаардагдах гэрэлтэлт",
              value:
                normalLuminosityTab[parseInt(lightType)][parseInt(roomType)],
              unit: "Лк",
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
              label: "Шаардагдах гэрэлтүүлэгчийн тоо",
              unit: "ширхэг",
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
                          {result}
                        </Text>
                      )}
                    </Text>
                  </View>
                );
              })}
            </>
          );
        })()}
      </ResultModal>
      <FormPicker
        label="Өрөөний зориулалт"
        icon="blur"
        options={roomTypesOptions}
        onValueChange={(value) => setRoomType(value)}
        value={roomType ? roomType : "0"}
      />
      <FormPicker
        label="Гэрлийн үүсгүүрийн төрөл"
        icon="lightbulb-cfl"
        options={lightTypesOptions}
        onValueChange={(value) => setLightType(value)}
        value={lightType ? lightType + "" : "0"}
      />
      <FormPicker
        label="Гэрэлтүүлгийн чадал"
        icon="lightning-bolt"
        options={powerLightOptions[parseInt(lightType)]}
        onValueChange={(value) => setPowerLight(value)}
        value={powerLight ? powerLight + "" : "0"}
      />
      <FormPicker
        label="Тооцооны өндөр"
        icon="alpha-h"
        options={heightOptions}
        onValueChange={(value) => setHeight(value)}
        value={height ? height + "" : "0"}
      />
      <Textfield
        label="Өрөөний талбай, (м.кв)"
        placeholder="1000 хүртэл утга оруулна уу"
        icon={"alpha-s"}
        keyboardType="numeric"
        value={value.area ? value.area + "" : ""}
        onChangeText={(value) => valueChanger(value, ["area"], [10, 1000])}
        error={{
          text: "Та 10-1000м хүртэл уртын утга оруулна уу",
          show: error.area,
        }}
      />
      <MyButton disable={!value.area || value.area === "0"} onPress={calc}>
        Тооцоолох
      </MyButton>
      <View style={{ marginBottom: 20 }}></View>
    </ScrollView>
  );
};

export default PrivatePowerScreen;

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
