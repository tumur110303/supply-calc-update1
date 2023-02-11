import { FC, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, View, Alert } from "react-native";

import CalcContext from "../../../../context/CalcContext";
import Button from "../../../../components/Button";
import Textfield from "../../../../components/Textfield";
import FormPicker from "../../../../components/FormPicker";
import { dark, light, main, w400, w500 } from "../../../../constants";
import Modal from "../../../../components/ResultModal";
import CountContext from "../../../../context/CountContext";
import OnOffSwitch from "../../../../components/switches/OnOffSwitch";

type Value = {
  floor: boolean;
  people?: number;
  lighting?: string;
  firePump?: string;
  pump?: {
    quantity?: number;
    load?: string;
  };
  fan?: {
    quantity?: number;
    load?: string;
  };
  heater?: {
    quantity?: number;
    load?: string;
  };
  lift?: {
    quantity?: number;
    load?: string;
  };
  cable: "AC" | "CC" | "AW" | "CW";
};
type Error = {
  floor?: boolean;
  people?: boolean;
  lighting?: boolean;
  firePump?: boolean;
  pump?: boolean;
  fan?: boolean;
  heater?: boolean;
  lift?: boolean;
  cable?: boolean;
};
type Have = {
  fire: boolean;
  pump: boolean;
  fan: boolean;
  heater: boolean;
  lift: boolean;
};

const ApartmentInput: FC = () => {
  const { increase } = useContext(CountContext);
  const calcContext = useContext(CalcContext);

  const [value, setValue] = useState<Value>({
    floor: false,
    cable: "AC",
  });
  const [have, setHave] = useState<Have>({
    fire: false,
    pump: false,
    fan: false,
    heater: false,
    lift: false,
  });
  const layers = [
    { label: "12 ба түүнээс доош давхар барилга", value: false },
    { label: "12-с дээш давхар барилга", value: true },
  ];
  const cables = [
    { label: "Хөнгөнцагаан кабель", value: "AC" },
    { label: "Хөнгөнцагаан утас", value: "AW" },
    { label: "Зэс кабель", value: "CC" },
    { label: "Зэс утас", value: "CW" },
  ];
  const [error, setError] = useState<Error>({
    floor: false,
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const [power, setPower] = useState<number>();
  const [result, setResult] = useState<any>();
  const [section, setSection] = useState<string | number>();
  const [resultEmergency, setResultEmergency] = useState<any>();
  const [sectionFire, setSectionFire] = useState<string | number>();

  useEffect(() => {
    // Товч идэвхитэй, идэвхигүйг тодорхойлно.
    let disabled = true;
    disabled = !Object.values(error).every((el) => el !== true);
    if (!value.people) {
      disabled = true;
    }

    if (
      (value.fan?.load && !value.fan.quantity) ||
      (!value.fan?.load && value.fan?.quantity)
    )
      disabled = true;
    else if (
      (value.heater?.load && !value.heater.quantity) ||
      (!value.heater?.load && value.heater?.quantity)
    )
      disabled = true;
    else if (
      (value.pump?.load && !value.pump.quantity) ||
      (!value.pump?.load && value.pump?.quantity)
    )
      disabled = true;
    else if (
      (value.lift?.load && !value.lift.quantity) ||
      (!value.lift?.load && value.lift?.quantity)
    )
      disabled = true;
    else disabled = false;

    // Disabled variable оноох...
    setDisabled(disabled);
  }, [value, error]);

  const numberTab = [
    3, 4, 5, 6, 9, 12, 15, 18, 24, 40, 60, 100, 200, 400, 600, 1000,
  ];
  const privLoadTab = [
    10, 7.5, 6, 5.1, 3.8, 3.2, 2.8, 2.6, 2.2, 1.95, 1.7, 1.5, 1.36, 1.27, 1.23,
    1.19,
  ];

  const reset = () => {
    setValue({
      floor: false,
      cable: "AC",
    });
    setHave({
      fire: false,
      pump: false,
      fan: false,
      heater: false,
      lift: false,
    });
    setResult(undefined);
    setResultEmergency(undefined);
    setSectionFire(undefined);
    setVisible(false);
    setSection(undefined);
    setPower(undefined);
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
      if (key === "floor") {
        if (number > 24 || number < 0) {
          setValue((state) => {
            const copy = { ...state };
            copy[key] = true;

            return copy;
          });
        }
      } else {
        if (
          key === "heater" ||
          key === "pump" ||
          key === "fan" ||
          key === "lift"
        ) {
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
      if (
        key === "heater" ||
        key === "pump" ||
        key === "fan" ||
        key === "lift"
      ) {
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

  const publicCalc = async (
    huviinChadal: any,
    coeff: any,
    coeffElevator: any
  ) => {
    const { lighting, pump, fan, firePump, people, cable, heater, lift } =
      value;
    if (people && cable && calcContext) {
      let pumpLoadValue = 0;
      let funLoadValue = 0;
      let heaterLoadValue = 0;
      let elevatorLoadValue = 0;
      let lightLoadValue = 0;
      let firePumpLoadValue = 0;

      let quantityHeater = 0;
      let quantityFun = 0;
      let quantityPump = 0;

      // null undefined or 0
      if (!lighting) {
        lightLoadValue = 0;
      } else if (parseFloat(lighting) < 11) {
        lightLoadValue = 0;
      } else {
        lightLoadValue = parseFloat(lighting) - 10;
      }

      if (!pump?.quantity || !pump.load) {
        pumpLoadValue = 0;
        quantityPump = 0;
      } else {
        pumpLoadValue = parseFloat(pump.load);
        quantityPump = pump.quantity;
      }

      if (!fan?.quantity || !fan.load) {
        funLoadValue = 0;
        quantityFun = 0;
      } else {
        funLoadValue = parseFloat(fan.load);
        quantityFun = fan.quantity;
      }

      if (!heater?.quantity || !heater.load) {
        heaterLoadValue = 0;
        quantityHeater = 0;
      } else {
        heaterLoadValue = parseFloat(heater.load);
        quantityHeater = heater.quantity;
      }

      if (!lift?.quantity || !lift.load) {
        elevatorLoadValue = 0;
      } else {
        elevatorLoadValue = parseFloat(lift.load);
      }

      // Хэвийн үеийн тооцоо...
      setVisible(true);
    }
  };

  const calc = async () => {
    // console.log("zugeer l calc...");
    calcContext
      ? calcContext?.conductor(39, "CW", "TT", true)
      : "calcContext алгаа...";

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
        <Text style={css.subtitle}>Өгөгдөл</Text>
        {(() => {
          const data = [
            {
              label: "Сууцны тоо",
              value: value.people,
              unit: null,
            },
            {
              label: "Гэрэлтүүлгийн суурилагдсан чадал",
              value: value.lighting,
              unit: "кВт",
            },
            {
              label: "Сэнсний суурилагдсан чадал",
              value: value.fan?.load,
              unit: "кВт",
            },
            {
              label: "Насосны суурилагдсан чадал",
              value: value.pump?.load,
              unit: "кВт",
            },
            {
              label: "Халаах төхөөрөмжийн суурилагдсан чадал",
              value: value.heater?.load,
              unit: "кВт",
            },
            {
              label: "Галын насос, сэнсний суурилагдсан чадал",
              value: value.firePump,
              unit: "кВт",
            },
            {
              label: "Лифтний суурилагдсан чадал",
              value: value.lift?.load,
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
              label: "Кабель ",
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
        <Text style={css.subtitle}>Галын үед ажиллах төхөөрөмжүүд</Text>
        {(() => {
          const data = [
            {
              label: "Суурилагдсан чадал",
              unit: " кВт",
            },
            {
              label: "Хэвийн гүйдэл",
              unit: "A",
            },
            {
              label: "Автомат таслуурын гүйдэл",
              unit: "A",
            },
          ];
          return value.firePump ? (
            <View>
              <View style={css.modalItem}>
                <Text style={{ fontFamily: w400, color: main, marginRight: 5 }}>
                  ЦХНА-ны зэрэглэл :
                </Text>
                <Text style={{ fontFamily: w400 }}>I</Text>
              </View>
              {data.map(({ label, unit }, i) => {
                if (resultEmergency && resultEmergency[i]) {
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
                      <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                        {Math.round(resultEmergency[i] * 100) / 100} {unit}
                      </Text>
                    </View>
                  );
                }
              })}
              <View style={css.modalItem}>
                <Text style={{ fontFamily: w400, color: main, marginRight: 5 }}>
                  Кабель :
                </Text>
                <Text style={{ fontFamily: w400 }}>
                  ВВГнг-(A)-LS {sectionFire}
                </Text>
              </View>
            </View>
          ) : null;
        })()}
      </Modal>
      <Text style={css.title}>Ерөнхий өгөгдөл</Text>

      <FormPicker
        label="Барилгын давхрын тоо"
        icon="office-building"
        options={layers}
        onValueChange={(value: any) => {
          setValue((state) => {
            const copyState = { ...state };
            copyState.floor = value;
            return copyState;
          });
        }}
        value={value.floor}
      />
      <Textfield
        label="Сууцны тоог оруулна уу"
        placeholder="1000-аас бага тоо оруулна уу"
        icon="home-city"
        keyboardType="numeric"
        value={value.people ? value.people + "" : ""}
        onChangeText={(value) => valueChanger(value, "people", [1, 1000])}
        error={{
          text: "Та 1-1000 хүртэлх бүхэл тоо оруулна уу",
          show: error.people,
        }}
      />
      <Textfield
        label="Гэрэлтүүлгийн чадлыг оруулна уу"
        placeholder="100-аас бага тоо оруулна уу"
        icon="lightbulb-on"
        keyboardType="numeric"
        value={value.lighting ? value.lighting + "" : ""}
        onChangeText={(value) =>
          valueChangerButarhai(value, "lighting", [0, 100])
        }
        error={{
          text: "Та 0-100кВт хүртэл чадлын утга оруулна уу",
          show: error.lighting,
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

      <OnOffSwitch
        onValueChange={() => {
          setHave((state) => {
            const copy = { ...state };
            copy.fire = !copy.fire;
            return copy;
          });
        }}
        value={have.fire}
        label="Гал үед ажиллах төхөөрөмжүүд"
      />
      <OnOffSwitch
        onValueChange={() => {
          setHave((state) => {
            const copy = { ...state };
            copy.pump = !copy.pump;
            return copy;
          });
        }}
        value={have.pump}
        label="Усны болон халаалтын насос"
      />
      <OnOffSwitch
        onValueChange={() => {
          setHave((state) => {
            const copy = { ...state };
            copy.fan = !copy.fan;
            return copy;
          });
        }}
        value={have.fan}
        label="Агааржуулах төхөөрөмжүүд"
      />
      <OnOffSwitch
        onValueChange={() => {
          setHave((state) => {
            const copy = { ...state };
            copy.heater = !copy.heater;
            return copy;
          });
        }}
        value={have.heater}
        label="Агаар халаагч, агаарын дулаан хөшиг"
      />
      <OnOffSwitch
        onValueChange={() => {
          setHave((state) => {
            const copy = { ...state };
            copy.lift = !copy.lift;
            return copy;
          });
        }}
        value={have.lift}
        label="Лифт"
      />

      {/* Хүчний төхөөрөмжүүд... */}

      {have.fire || have.fan || have.heater || have.lift || have.pump ? (
        <Text style={{ ...css.title, marginTop: 15 }}>
          Хүчний төхөөрөмжийн өгөгдөл
        </Text>
      ) : null}
      {have.fire ? (
        <Textfield
          label="Галын үед ажиллах сэнс, насосууд"
          placeholder="Нийт чадал, кВт"
          icon="fire-extinguisher"
          keyboardType="numeric"
          value={value.firePump ? value.firePump + "" : ""}
          onChangeText={(value) =>
            valueChangerButarhai(value, "firePump", [0, 500])
          }
          error={{
            text: "Та 0-500кВт хүртэл чадлын утга оруулна уу",
            show: error.firePump,
          }}
        />
      ) : null}
      {have.pump ? (
        <Textfield
          label="Галын бус насоснууд"
          placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
          icon={["water-pump", "lightning-bolt"]}
          keyboardType="numeric"
          check
          value={[
            value.pump
              ? value.pump.quantity
                ? value.pump.quantity + ""
                : ""
              : "",
            value.pump ? (value.pump.load ? value.pump.load + "" : "") : "",
          ]}
          onChangeText={(value) =>
            valueChanger(value, ["pump", "quantity"], [1, 1000])
          }
          checkChangeText={(value) =>
            valueChangerButarhai(value, ["pump", "load"], [0, 500])
          }
          error={{
            text: "Та 0-500кВт хүртэл чадлын утга оруулна уу",
            show: error.pump,
          }}
        />
      ) : null}

      {have.fan ? (
        <Textfield
          label="Агааржуулах сэнс, кондиционер"
          placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
          icon={["fan", "lightning-bolt"]}
          keyboardType="numeric"
          check
          value={[
            value.fan
              ? value.fan.quantity
                ? value.fan.quantity + ""
                : ""
              : "",
            value.fan ? (value.fan.load ? value.fan.load + "" : "") : "",
          ]}
          onChangeText={(value) =>
            valueChanger(value, ["fan", "quantity"], [1, 1000])
          }
          checkChangeText={(value) =>
            valueChangerButarhai(value, ["fan", "load"], [0, 500])
          }
          error={{
            text: "Та 0-500кВт хүртэл чадлын утга оруулна уу",
            show: error.fan,
          }}
        />
      ) : null}

      {have.heater ? (
        <Textfield
          label="Агаар халаагч, цахилгаан халаах элементүүд"
          placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
          icon={["air-filter", "lightning-bolt"]}
          keyboardType="numeric"
          check
          value={[
            value.heater
              ? value.heater.quantity
                ? value.heater.quantity + ""
                : ""
              : "",
            value.heater
              ? value.heater.load
                ? value.heater.load + ""
                : ""
              : "",
          ]}
          onChangeText={(value) =>
            valueChanger(value, ["heater", "quantity"], [1, 1000])
          }
          checkChangeText={(value) =>
            valueChangerButarhai(value, ["heater", "load"], [0, 600])
          }
          error={{
            text: "Та 0-600кВт хүртэл чадлын утга оруулна уу",
            show: error.heater,
          }}
        />
      ) : null}

      {have.lift ? (
        <Textfield
          label="Лифт"
          placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
          icon={["elevator-passenger", "lightning-bolt"]}
          keyboardType="numeric"
          check
          value={[
            value.lift
              ? value.lift.quantity
                ? value.lift.quantity + ""
                : ""
              : "",
            value.lift ? (value.lift.load ? value.lift.load + "" : "") : "",
          ]}
          onChangeText={(value) =>
            valueChanger(value, ["lift", "quantity"], [1, 1000])
          }
          checkChangeText={(value) =>
            valueChangerButarhai(value, ["lift", "load"], [0, 300])
          }
          error={{
            text: "Та 0-300кВт хүртэл чадлын утга оруулна уу",
            show: error.lift,
          }}
        />
      ) : null}
      <Button disable={disabled} onPress={calc}>
        Тооцоолох
      </Button>
      <View style={{ marginBottom: 20 }}></View>
    </ScrollView>
  );
};

export default ApartmentInput;

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
