import { FC, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, View, Alert } from "react-native";

import CalcContext from "../../context/CalcContext";
import CountContext from "../../context/CountContext";

import Button from "../../components/Button";
import Textfield from "../../components/Textfield";
import FormPicker from "../../components/FormPicker";
import { dark, light, main, w400, w500 } from "../../constants";
import Modal from "../../components/ResultModal";
import Switch from "../../components/switches/Switch";
import * as Animatable from "react-native-animatable";

type Value = {
  people?: number;
  plumb?: {
    quantity?: number;
    load?: string;
  };
  cable: "CC" | "CW";
};
type Error = {
  people?: boolean;
  plumb?: boolean;
  cable?: boolean;
};

const ApartmentMeterRadial: FC = () => {
  const calcContext = useContext(CalcContext);
  const { increase } = useContext(CountContext);

  const [value, setValue] = useState<Value>({
    cable: "CW",
  });
  const [have, setHave] = useState(false);
  const cables = [
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
    if (!value.people) {
      disabled = true;
    } else if (
      (value.plumb?.load && !value.plumb.quantity) ||
      (!value.plumb?.load && value.plumb?.quantity)
    )
      disabled = true;
    else disabled = false;

    // Disabled variable оноох...
    setDisabled(disabled);
  }, [value, error]);

  const reset = () => {
    setValue({
      cable: "CW",
    });
    setHave(false);
    setResult(undefined);
    setVisible(false);
    setError({});
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

      if (key === "plumb") {
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
      if (key === "plumb") {
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
    //   01. Утга авах хэсэг
    if (calcContext) {
      const quantityHouse = value.people ? value.people : 0;
      const plumbLoad =
        value.plumb && value.plumb.load ? parseFloat(value.plumb.load) : 0;
      const quantityPlumb =
        value.plumb && value.plumb.quantity ? value.plumb.quantity : 0;

      // 02. Ачаалал бодох хэсэг...
      const housingLoad = calcContext.apartmentCalc(quantityHouse);
      const loadPlumb = calcContext.calcPlumb(quantityPlumb, plumbLoad);

      // 2.1. Тооцооны ачаалал...
      const power = housingLoad + 0.9 * loadPlumb;

      //   2.2. Чадлын коэффициент...
      const powerFactor = calcContext.equilentPowerFactor(
        [housingLoad, loadPlumb],
        [0.98, 0.8]
      );
      // 2.3. Тооцооны гүйдэл...
      const current = calcContext.currentThreePhase(
        power,
        powerFactor !== 0 ? powerFactor : 0.98
      );

      //   2.4. Бүрэн чадал...
      const capacity = power / powerFactor;

      //   2.5. Автомат...
      const circuitBreaker = calcContext.circuitBreaker(current);

      //   2.6. Хөндлөн огтлол
      const sectionValue = calcContext.conductor(
        circuitBreaker,
        value.cable,
        true
      );

      const section = calcContext.stringifySection(
        sectionValue,
        value.cable,
        true
      );

      //   03. Үр дүнг нэгтгэх...
      setResult([
        power,
        current,
        capacity,
        powerFactor,
        circuitBreaker !== 0
          ? circuitBreaker
          : "Хэт их ачаалалтай байгаа тул ачааллыг хувааж дамжуулна уу!",
        section,
      ]);
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
        <View style={css.modalItem}>
          <Text
            style={{
              flexDirection: "row",
              width: "90%",
              flexWrap: "wrap",
            }}
          ></Text>
        </View>
        {(() => {
          const data = [
            {
              label: "Сууцны тоо",
              value: value.people,
              unit: null,
            },
            {
              label: "Сантехникийн т/т-ийн нийт чадал",
              value: value.plumb?.load,
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
          const labelCable = value.cable === "CC" ? "Зэс кабель" : "Зэс утас";
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
              label: "Бүрэн чадал",
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
              label: labelCable,
              unit: "мм.кв",
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

      <Text style={css.title}>Ерөнхий өгөгдөл</Text>
      <Textfield
        label="Сууцны тоог оруулна уу"
        placeholder="8-аас бага тоо оруулна уу"
        icon="home-city"
        keyboardType="numeric"
        value={value.people ? value.people + "" : ""}
        onChangeText={(value) => valueChanger(value, "people", [1, 8])}
        error={{
          text: "Та 1-8 хүртэлх бүхэл тоо оруулна уу",
          show: error.people,
        }}
      />
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

      {/* Хүчний төхөөрөмжүүд... */}
      <Animatable.View
        animation={have ? "fadeInDown" : "fadeInUp"}
        duration={have ? 500 : 3000}
      >
        {have ? (
          <Text style={{ ...css.title, marginTop: 15 }}>
            Хүчний төхөөрөмжийн өгөгдөл
          </Text>
        ) : null}
        {have ? (
          <Textfield
            label="Сантехникийн тоног төхөөрөмжүүд"
            placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
            icon={["water-pump", "lightning-bolt"]}
            keyboardType="numeric"
            check
            value={[
              value.plumb
                ? value.plumb.quantity
                  ? value.plumb.quantity + ""
                  : ""
                : "",
              value.plumb
                ? value.plumb.load
                  ? value.plumb.load + ""
                  : ""
                : "",
            ]}
            onChangeText={(value) => valueChanger(value, ["plumb", "quantity"])}
            checkChangeText={(value) =>
              valueChangerButarhai(value, ["plumb", "load"], [0, 20])
            }
            error={{
              text: "Та 0-20кВт хүртэл чадлын утга оруулна уу",
              show: error.plumb,
            }}
          />
        ) : null}
      </Animatable.View>
      <Animatable.View
        animation={have ? "pulse" : "fadeInUp"}
        duration={have ? 3000 : 500}
      >
        <Switch
          onPress={() => setHave(!have)}
          value={have}
          label="Хүчний төхөөрөмжүүд"
          innerText={["Off", "On"]}
        />
      </Animatable.View>
      <Button disable={disabled} onPress={calc}>
        Тооцоолох
      </Button>
      <View style={{ marginBottom: 20 }}></View>
    </ScrollView>
  );
};

export default ApartmentMeterRadial;

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
