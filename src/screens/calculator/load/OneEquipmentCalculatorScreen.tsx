import { StyleSheet, Text, View, Alert, ScrollView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import CalcContext from "../../../context/CalcContext";
import Modal from "../../../components/ResultModal";
import { dark, light, main, w400, w500 } from "../../../constants";
import Textfield from "../../../components/Textfield";
import FormSwitch from "../../../components/switches/FormSwitch";
import FormPicker from "../../../components/FormPicker";
import Button from "../../../components/Button";
import CountContext from "../../../context/CountContext";

export default () => {
  const calcContext = useContext(CalcContext);
  const { increase } = useContext(CountContext);

  type Value = {
    loadMotor?: number;
    powerFactor?: number;
    lineLength?: number;
    acceptVoltageDrop?: number;
    cable: string;
  };

  type Error = {
    loadMotor?: boolean;
    powerFactor?: boolean;
    lineLength?: boolean;
    acceptVoltageDrop?: boolean;
    cable: boolean;
  };

  // Өгөгдөл
  const [value, setValue] = useState<Value>({
    cable: "CC1",
  });
  const [acceptVoltage, setAcceptVoltage] = useState<any>();
  const [section, setSection] = useState<string | number>();

  // Туслах
  const [disabled, setDisabled] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [errorShow, setErrorShow] = useState<Error>({
    loadMotor: false,
    powerFactor: false,
    lineLength: false,
    acceptVoltageDrop: false,
    cable: false,
  });

  // Гүйдэл тодорхойлоход шаардагдах Switch-ийн утгууд...
  const [endConnectStar, setEndConnectStar] = useState<boolean>(true);
  const [threePhaseCheck, setThreePhaseCheck] = useState<boolean>(true);

  const cables = [
    { label: "ВВГ", value: "CC1" },
    { label: "КГ", value: "CC2" },
    { label: "ВВГнг-LS", value: "CCF" },
    { label: "АВБбШв", value: "AC1" },
    { label: "АВВГ", value: "AC2" },
  ];
  // Үр дүн :
  const [res, setRes] = useState<any>();
  const [result, setResult] = useState<any>();

  // ###########################  ГОЛ ТООЦООНЫ ФУНКЦУУД ###########################
  const publicCalc = async (obj: any) => {
    const normalResult = obj;
    // Contactor & reley...
    let contactorCurrent = normalResult.current;

    let turRes: any = "";

    if (normalResult) turRes = Object.entries(normalResult);

    let sectionRes = turRes[turRes.length - 1][1];

    turRes.splice(turRes.length - 1, 1);

    setSection((section) => (section = sectionRes));
    setResult([...turRes.map((el: any) => el[1]), contactorCurrent]);

    await increase();
  };

  const calc = () => {
    const { loadMotor, powerFactor, lineLength, acceptVoltageDrop, cable } =
      value;

    // Хуурах зорилготой хувьсагчид :
    const loadStr = loadMotor + "";
    const pfStr = powerFactor + "";
    const lengthStr = lineLength + "";
    const voltageStr = acceptVoltageDrop + "";

    let load: number = 0;
    let pf: number = 0;
    let length: number = 0;
    let voltage: number = 0;

    if (!loadMotor) {
      load = 0;
    } else {
      load = parseFloat(loadStr);
    }

    if (!powerFactor) {
      pf = 0;
    } else {
      pf = parseFloat(pfStr);
    }

    if (!lineLength) {
      length = 0;
    } else {
      length = parseFloat(lengthStr);
    }

    if (!acceptVoltageDrop) {
      voltage = 0;
    } else {
      voltage = parseFloat(voltageStr);
    }

    setAcceptVoltage(voltage);

    const resDam = threePhaseCheck
      ? calcContext?.currentOneEquipmentThreePhase(
          load,
          pf,
          cable,
          voltage,
          length,
          endConnectStar
        )
      : calcContext?.currentOneEquipmentOnePhase(
          load,
          pf,
          cable,
          voltage,
          length
        );

    setRes(resDam);
    setVisible(true);
  };

  useEffect(() => {
    res && publicCalc(res);
  }, [value, res, section, threePhaseCheck, endConnectStar]);

  // ############################  FORM -ТОЙ АЖИЛЛАХ ФУНКЦУУД  ############################
  const reset = () => {
    setValue({
      cable: "CC1",
    });
    setResult(undefined);
    setSection(undefined);
    setVisible(false);
  };

  const valueChanger = (
    text: string,
    id: keyof Value,
    validation?: [number, number]
  ) => {
    const key = id;
    if (text !== "") {
      const number = text;

      if (validation) {
        if (
          parseFloat(number) < validation[0] ||
          validation[1] < parseFloat(number)
        ) {
          setErrorShow((state) => {
            state[key] = true;
            return state;
          });
        } else {
          setErrorShow((state) => {
            state[key] = false;
            return state;
          });
        }
      } else {
        setErrorShow((state) => {
          state[key] = false;
          return state;
        });
      }

      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = number;

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

  const valueChangerVoltage = (
    text: string,
    id: keyof Value,
    validation?: [number, number]
  ) => {
    const key = id;
    if (text !== "") {
      const number = text;

      const jishihNumber = number.startsWith("-")
        ? parseFloat(number)
        : parseFloat(number);
      if (validation) {
        if (jishihNumber < validation[0] || validation[1] < jishihNumber) {
          setErrorShow((state) => {
            state[key] = true;
            return state;
          });
        } else {
          setErrorShow((state) => {
            state[key] = false;
            return state;
          });
        }
      } else {
        setErrorShow((state) => {
          state[key] = false;
          return state;
        });
      }

      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = number;

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

  useEffect(() => {
    // Товч идэвхитэй, идэвхигүйг тодорхойлно.
    let disabled = true;
    disabled = !Object.values(errorShow).every((el) => el !== true);
    if (!value.loadMotor) {
      disabled = true;
    }

    setDisabled(disabled);
  }, [value, errorShow]);

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
              label: "Хөдөлгүүрийн хэвийн чадал",
              value: value.loadMotor,
              unit: "кВт",
            },
            {
              label: "Чадлын коэффициент",
              value: value.powerFactor,
              unit: null,
            },
            {
              label: "Шугамын утасны урт",
              value: value.lineLength,
              unit: "м",
            },
            {
              label: "Хүчдэлийн зөвшөөрөгдөх алдагдал",
              value: acceptVoltage,
              unit: "%",
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
              label: "Хөдөлгүүрийн хэвийн гүйдэл",
              unit: "А",
            },
            {
              label: "Автомат таслуурын гүйдэл",
              unit: "А",
            },
            {
              label: "Шугамын хүчдэлийн алдагдал",
              unit: "%",
            },
            {
              label: "Контакторын хэвийн гүйдэл",
              unit: "А-аас их",
            },
            {
              label: "Кабель",
              value: `${
                cables.find((item) => item.value === value.cable)?.label
              } ${section}`,
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
      <Textfield
        label="Хэвийн чадлыг оруулна уу, (кВт)"
        placeholder={
          threePhaseCheck
            ? "100-аас бага тоо оруулна уу"
            : "15-аас бага тоо оруулна уу"
        }
        icon="alpha-p"
        keyboardType="numeric"
        value={value.loadMotor ? value.loadMotor + "" : ""}
        onChangeText={(value) =>
          valueChanger(value, "loadMotor", threePhaseCheck ? [1, 100] : [1, 15])
        }
        error={{
          text: threePhaseCheck
            ? "Та 1-100 хүртэлх тоо оруулна уу"
            : "Та 1-15 хүртэлх тоо оруулна уу",
          show: errorShow.loadMotor,
        }}
      />
      <Textfield
        label="Чадлын коэффициентийг оруулна уу"
        placeholder="0-1-ийн хооронд утга оруулна уу"
        icon="lightning-bolt"
        keyboardType="numeric"
        value={value.powerFactor ? value.powerFactor + "" : ""}
        onChangeText={(value) => valueChanger(value, "powerFactor", [0, 1])}
        error={{
          text: "Та 0-1 хүртэлх тоо оруулна уу",
          show: errorShow.powerFactor,
        }}
      />
      <Textfield
        label="Тэжээх шугамын уртыг оруулна уу, (м)"
        placeholder={
          threePhaseCheck
            ? "200-аас бага тоо оруулна уу"
            : "50-аас бага тоо оруулна уу"
        }
        icon="alpha-l"
        keyboardType="numeric"
        value={value.lineLength ? value.lineLength + "" : ""}
        onChangeText={(value) =>
          valueChanger(
            value,
            "lineLength",
            threePhaseCheck ? [1, 200] : [1, 50]
          )
        }
        error={{
          text: threePhaseCheck
            ? "Та 1-200 хүртэлх тоо оруулна уу"
            : "Та 1-50 хүртэлх тоо оруулна уу",
          show: errorShow.lineLength,
        }}
      />
      <Textfield
        label="Зөвшөөрөгдөх хүчдэлийн алдагдал, (%)"
        placeholder="1-5%-ын хооронд утга оруулна уу"
        icon="percent"
        keyboardType="numeric"
        value={value.acceptVoltageDrop ? value.acceptVoltageDrop + "" : ""}
        onChangeText={(value) =>
          valueChangerVoltage(value, "acceptVoltageDrop", [1, 5])
        }
        error={{
          text: "Та 1-5% хүртэлх утга оруулна уу",
          show: errorShow.acceptVoltageDrop,
        }}
      />
      <FormSwitch
        icon="lightning-bolt"
        onValueChange={setThreePhaseCheck}
        trueText="3-н фазын тоног төхөөрөмж"
        falseText="1 фазын тоног төхөөрөмж"
        value={threePhaseCheck}
        label="Фазын тоог оруулна уу"
      />
      <FormPicker
        label="Кабелийн маяг"
        icon="google-circles-communities"
        options={cables}
        onValueChange={(value) => valueChanger(value, "cable", [1, 200])}
        value={value.cable ? value.cable : ""}
      />
      <Button disable={disabled} onPress={calc}>
        Тооцоолох
      </Button>
    </ScrollView>
  );
};

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
