import { FC, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, View, Alert } from "react-native";

import CalcContext from "../../../context/CalcContext";
import Button from "../../../components/Button";
import Textfield from "../../../components/Textfield";
import FormPicker from "../../../components/FormPicker";
import { dark, light, main, w400, w500 } from "../../../constants";
import Modal from "../../../components/ResultModal";
import CountContext from "../../../context/CountContext";
import OnOffSwitch from "../../../components/switches/OnOffSwitch";

type Value = {
  earthSystem: boolean;
  otherEquipment?: {
    quantity?: number;
    load?: string;
  };
  heater?: {
    quantity?: number;
    load?: string;
  };
  cable: "AC" | "CC" | "AW" | "CW";
};
type Error = {
  earthSystem?: boolean;
  otherEquipment?: {
    quantity?: boolean;
    load?: boolean;
  };
  heater?: {
    quantity?: boolean;
    load?: boolean;
  };
  cable?: boolean;
};

const PlumbCalculatorScreen: FC = () => {
  const { increase } = useContext(CountContext);
  const calcContext = useContext(CalcContext);

  const [value, setValue] = useState<Value>({
    earthSystem: true,
    cable: "AC",
  });

  const cables = [
    { label: "Хөнгөнцагаан кабель", value: "AC" },
    { label: "Хөнгөнцагаан утас", value: "AW" },
    { label: "Зэс кабель", value: "CC" },
    { label: "Зэс утас", value: "CW" },
  ];
  const [error, setError] = useState<Error>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const [result, setResult] = useState<any>();

  useEffect(() => {
    // Товч идэвхитэй, идэвхигүйг тодорхойлно.
    let disabled = true;
    disabled = !Object.values(error).every((el) => el !== true);
    if (!value.otherEquipment?.quantity && value.otherEquipment?.load)
      disabled = true;
    else if (value.otherEquipment?.quantity && !value.otherEquipment.load)
      disabled = true;
    else if (!value.heater?.quantity && value.heater?.load) disabled = true;
    else if (value.heater?.quantity && !value.heater.load) disabled = true;
    else if (!value.heater && !value.otherEquipment) disabled = true;
    else disabled = false;

    // Disabled variable оноох...
    setDisabled(disabled);
  }, [value, error]);

  const reset = () => {
    setValue({
      cable: "AC",
      earthSystem: true,
    });
    setResult(undefined);
    setVisible(false);
  };

  const valueChanger = (
    text: string,
    id: keyof Value | [keyof Value, "quantity"],
    validation?: [number, number]
  ) => {
    const key = typeof id === "object" ? id[0] : id;
    if (text !== "") {
      const number = parseInt(text);
      if (validation) {
        if (number < validation[0] || validation[1] < number) {
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
      if (key === "heater" || key === "otherEquipment") {
        setValue((value) => {
          const copy: any = { ...value };
          if (typeof id === "object") {
            if (!copy[key]) copy[key] = {};

            if (id[1] === "quantity") {
              copy[key].quantity = number;
            } else {
              copy[key].load = number;
            }
          }

          return copy;
        });
      } else {
        setValue((value) => {
          const copy: any = { ...value };
          copy[key] = number;

          return copy;
        });
      }
    } else {
      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = undefined;

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
    if (text !== "") {
      const number = text;
      if (validation) {
        if (
          parseInt(number) < validation[0] ||
          validation[1] < parseInt(number)
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
      if (key === "heater" || key === "otherEquipment") {
        setValue((value) => {
          const copy: any = { ...value };
          if (typeof id === "object") {
            if (!copy[key]) copy[key] = {};

            copy[key].load = number;
          }

          return copy;
        });
      } else {
        setValue((value) => {
          const copy: any = { ...value };
          copy[key] = number;

          return copy;
        });
      }
    } else {
      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = undefined;

        return copy;
      });
    }
  };

  const calc = async () => {
    if (calcContext) {
      const quantityOther = value.otherEquipment?.quantity
        ? value.otherEquipment.quantity
        : 0;
      const quantityHeater = value.heater?.quantity ? value.heater.quantity : 0;
      const otherLoad = value.otherEquipment?.load
        ? parseFloat(value.otherEquipment.load)
        : 0;
      const heaterLoad = value.heater?.load ? parseFloat(value.heater.load) : 0;
      // Тооцооны ачаалал...
      const power = calcContext.calcPlumb(
        quantityHeater + quantityOther,
        otherLoad + heaterLoad
      );
      // Тооцооны гүйдэл ба cosф...
      const pf = calcContext.equilentPowerFactor(
        [otherLoad, heaterLoad],
        [0.8, 0.98]
      );
      const powerFactor = typeof pf === "number" ? pf : 0.8;
      const current = calcContext.currentThreePhase(power, powerFactor);
      const circuitBreaker = calcContext.circuitBreaker(current);
      // ################### !!!!!!!!!!!!!!!!!!!!!!
      const section = "string авна шүү...";
      // ##################### !!!!!!!!!!!!!!!!!!!!!!!!!!!

      // result...
      setResult([power, current, powerFactor, circuitBreaker, section]);
    }

    setVisible(true);
    await increase();
  };

  return (
    <ScrollView style={css.container}>
      <Modal
        visible={visible}
        setVisible={setVisible}
        title="Тооцооны хариу"
        reset={reset}
      >
        <Text style={css.subtitle}>Өгөгдөл : </Text>
        {(() => {
          const data = [
            {
              label: "Нийт халаагуурын бус төхөөрөмжийн тоо",
              value: value.otherEquipment?.quantity,
              unit: null,
            },
            {
              label: "Нийт халаагуур, АДХ-ний тоо",
              value: value.heater?.quantity,
              unit: null,
            },
            {
              label: "Нийт халаагуурын бус төхөөрөмжийн суурилагдсан чадал",
              value: value.otherEquipment?.load,
              unit: "кВт",
            },
            {
              label: "Нийт халаагуур, АДХ-ний суурилагдсан чадал",
              value: value.heater?.load,
              unit: "кВт",
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
        <Text style={css.subtitle}>Үр дүн : </Text>
        {(() => {
          let labelCable = "Х/ц кабель";
          if (value.cable === "CC") labelCable = "Зэс кабель";
          else if (value.cable === "AW") labelCable = "Х/ц утас";
          else if (value.cable === "CW") labelCable = "Зэс утас";
          else labelCable = "Х/ц кабель";
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
              label: "Дундаж чадлын коэффициент",
              unit: null,
            },
            {
              label: "Автомат таслуурын гүйдэл",
              unit: "A",
            },
            {
              label: labelCable,
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
                          {result[i] && typeof result[i] === "number"
                            ? Math.round(result[i] * 1000) / 1000
                            : result[i]}{" "}
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
      <Text style={{ ...css.title, marginTop: 15 }}>
        Сантехникийн төхөөрөмжийн өгөгдөл :
      </Text>
      <Textfield
        label="Халаагуурын бус тоног төхөөрөмжийн тоо"
        placeholder="Нийт тоог оруулна уу"
        icon="alpha-n"
        keyboardType="numeric"
        value={
          value.otherEquipment?.quantity
            ? value.otherEquipment.quantity + ""
            : ""
        }
        onChangeText={(value) =>
          valueChanger(value, ["otherEquipment", "quantity"])
        }
      />
      <Textfield
        label="Цахилгаан халаагуур, дулаан хөшигний тоо"
        placeholder="Нийт тоог оруулна уу"
        icon="alpha-n"
        keyboardType="numeric"
        value={value.heater?.quantity ? value.heater.quantity + "" : ""}
        onChangeText={(value) => valueChanger(value, ["heater", "quantity"])}
      />
      <Textfield
        label="Халаагуураас бусад сантехникийн төхөөрөмжийн суурилагдсан чадал"
        placeholder="Нийт суурилагдсан чадал, кВт"
        icon="lightning-bolt"
        keyboardType="numeric"
        value={value.otherEquipment?.load ? value.otherEquipment.load + "" : ""}
        onChangeText={(value) =>
          valueChangerButarhai(value, ["otherEquipment", "load"])
        }
      />
      <Textfield
        label="Цахилгаан халаагуур, дулаан хөшигний суурилагдсан чадал"
        placeholder="Нийт суурилагдсан чадал, кВт"
        icon="lightning-bolt"
        keyboardType="numeric"
        value={value.heater?.load ? value.heater.load + "" : ""}
        onChangeText={(value) =>
          valueChangerButarhai(value, ["heater", "load"])
        }
      />
      <Text style={{ ...css.title, marginTop: 15 }}>Бусад өгөгдөл :</Text>
      <FormPicker
        label="Утас, кабель"
        icon="google-circles-communities"
        options={cables}
        onValueChange={(value: any) => {
          setValue((state) => {
            const copyState = { ...state };
            copyState.cable = value;
            return copyState;
          });
        }}
        value={value.cable}
      />

      <OnOffSwitch
        onValueChange={() => {
          setValue((state) => {
            const copy = { ...state };
            copy.earthSystem = !copy.earthSystem;
            return copy;
          });
        }}
        value={value.earthSystem}
        label={value.earthSystem ? "TN-S систем" : "TT систем"}
      />

      <Button disable={disabled} onPress={calc}>
        Тооцоолох
      </Button>
      <View style={{ marginBottom: 20 }}></View>
    </ScrollView>
  );
};

export default PlumbCalculatorScreen;

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
