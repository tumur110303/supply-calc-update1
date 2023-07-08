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
import SingleTextfield from "../../components/customComponents/SingleTextInput";
import SingleTextInput from "../../components/customComponents/SingleTextInput";

type Value = {
  earthSystem?: boolean;
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
  earthSystem?: boolean;
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

const ApartmentInput: FC = () => {
  const calcContext = useContext(CalcContext);
  const { increase } = useContext(CountContext);

  const [value, setValue] = useState<Value>({
    earthSystem: false,
    floor: false,
    cable: "AC",
  });
  const [have, setHave] = useState(false);
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

  const [result, setResult] = useState<any>();
  const [resultTotal, setResultTotal] = useState<any>();
  const [resultEmergency, setResultEmergency] = useState<any>();
  const [resultFire, setResultFire] = useState<any>();

  const doubleSupply = (value.people && value.people > 8) || value.firePump;

  useEffect(() => {
    // Товч идэвхитэй, идэвхигүйг тодорхойлно.
    let disabled = true;
    disabled = !Object.values(error).every((el) => el !== true);
    if (!value.people) {
      disabled = true;
    } else if (
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

  const reset = () => {
    setValue({
      earthSystem: false,
      floor: false,
      cable: "AC",
    });
    setHave(false);
    setResult(undefined);
    setResultEmergency(undefined);
    setResultTotal(undefined);
    setResultFire(undefined);
    setVisible(false);
    setError({ floor: false });
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

  const calc = async () => {
    //   01. Утга авах хэсэг
    if (calcContext) {
      const quantityHouse = value.people ? value.people : 0;
      const pumpLoad =
        value.pump && value.pump.load ? parseFloat(value.pump.load) : 0;
      const fanLoad =
        value.fan && value.fan.load ? parseFloat(value.fan.load) : 0;
      const heaterLoad =
        value.heater && value.heater.load ? parseFloat(value.heater.load) : 0;
      const elevatorLoad =
        value.lift && value.lift.load ? parseFloat(value.lift.load) : 0;
      const lightLoad =
        !value.lighting || parseFloat(value.lighting) < 10
          ? 0
          : parseFloat(value.lighting) - 10;
      const fireLoad = value.firePump ? parseFloat(value.firePump) : 0;

      const quantityHeater =
        value.heater && value.heater.quantity ? value.heater.quantity : 0;
      const quantityFan =
        value.fan && value.fan.quantity ? value.fan.quantity : 0;
      const quantityPump =
        value.pump && value.pump.quantity ? value.pump.quantity : 0;
      const quantityElevator =
        value.lift && value.lift.quantity ? value.lift.quantity : 0;

      // 02. Ачаалал бодох хэсэг...
      const housingLoad = calcContext.apartmentCalc(quantityHouse);
      const plumbLoad = calcContext.calcPlumb(
        quantityHeater + quantityFan + quantityPump,
        heaterLoad + fanLoad + pumpLoad
      );
      const elevatorLoadCalc = calcContext.elevatorCalc(
        quantityElevator,
        elevatorLoad,
        value.floor
      );

      // Тооцооны ачаалал...
      const power =
        housingLoad + lightLoad + 0.9 * (plumbLoad + elevatorLoadCalc);

      // Дундаж cosф...
      const toPowerPlumb = calcContext.calcPlumb(
        quantityFan + quantityPump,
        fanLoad + pumpLoad
      );
      const toPowerHeater = calcContext.calcPlumb(quantityHeater, heaterLoad);

      const powerFactor = calcContext.equilentPowerFactor(
        [housingLoad, toPowerPlumb, toPowerHeater, elevatorLoadCalc, lightLoad],
        [0.98, 0.8, 0.98, 0.65, 0.92]
      );

      // Тооцооны гүйдэл...
      const current = calcContext.currentThreePhase(
        power,
        powerFactor !== -1 ? powerFactor : 0.98
      );

      //   Галын насосны гүйдэл...
      const currentFire = calcContext.currentThreePhase(fireLoad, 0.8);

      const capacity = powerFactor !== -1 ? power / powerFactor : power;
      const capacityFire = fireLoad / 0.8;

      const circuitBreaker = doubleSupply
        ? calcContext.circuitBreaker(current / 2)
        : calcContext.circuitBreaker(current);
      const circuitBreakerFire = calcContext.circuitBreaker(currentFire);

      //   Хөндлөн огтлол
      const sectionValue = doubleSupply
        ? calcContext.conductor(
            current / 1.4 > circuitBreaker ? current / 1.4 : circuitBreaker,
            value.cable,
            value.earthSystem
          )
        : calcContext.conductor(circuitBreaker, value.cable, value.earthSystem);

      const section = calcContext.stringifySection(
        sectionValue,
        value.cable,
        value.earthSystem
      );

      const sectionFireValue = calcContext.conductor(
        circuitBreakerFire,
        "CC",
        true
      );

      const sectionFire = calcContext.stringifySection(
        sectionFireValue,
        "CC",
        true
      );

      //   03. Үр дүнг нэгтгэх...
      doubleSupply
        ? setResultTotal([power, current, capacity, powerFactor])
        : setResultTotal([]);
      doubleSupply
        ? setResult([
            power / 2,
            current / 2,
            capacity / 2,
            circuitBreaker !== 0
              ? circuitBreaker
              : "Хэт их ачаалалтай байгаа тул ачааллыг хувааж дамжуулна уу!",
          ])
        : setResult([
            power,
            current,
            capacity,
            powerFactor,
            circuitBreaker !== 0
              ? circuitBreaker
              : "Хэт их ачаалалтай байгаа тул ачааллыг хувааж дамжуулна уу!",
            section,
          ]);

      doubleSupply
        ? setResultEmergency([
            power / 1.4,
            current / 1.4,
            capacity / 1.4,
            section,
          ])
        : setResultEmergency([]);

      setResultFire([
        fireLoad,
        currentFire,
        capacityFire,
        circuitBreakerFire !== -1
          ? circuitBreakerFire
          : "Хэт их ачаалалтай байгаа тул ачааллыг хувааж дамжуулна уу!",
        sectionFire,
      ]);
    }

    setVisible(true);
    await increase();
  };

  //   Туршилтын функц...
  const experiment = () => {
    if (calcContext) {
      const value = calcContext.stringifySection(185, "CC");
      console.log("Хэвлэв : ", value);
    }
  };

  return (
    <ScrollView style={css.container}>
      {doubleSupply ? (
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
            >
              <Text
                style={{
                  fontFamily: w400,
                  color: main,
                  marginRight: 5,
                  flexWrap: "wrap",
                }}
              >
                ЦХНА-ны зэрэглэл :{" "}
              </Text>
              <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                I, II зэргийн хэрэглэгч
              </Text>
            </Text>
          </View>
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
                label: "Сэнсний нийт чадал",
                value: value.fan?.load,
                unit: "кВт",
              },
              {
                label: "Насосны нийт чадал",
                value: value.pump?.load,
                unit: "кВт",
              },
              {
                label: "Халаах төхөөрөмжийн нийт чадал",
                value: value.heater?.load,
                unit: "кВт",
              },
              {
                label: "Лифтний нийт чадал",
                value: value.lift?.load,
                unit: "кВт",
              },
              {
                label: "Галын насос, сэнсний чадал",
                value: value.firePump,
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

          <Text style={css.subtitle}>Үр дүн (нийт барилгаар) : </Text>
          {(() => {
            const data = [
              {
                label: "Тооцооны нийт чадал",
                unit: "кВт",
              },
              {
                label: "Тооцооны нийт гүйдэл",
                unit: "А",
              },
              {
                label: "Нийт бүрэн чадал",
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
                        {resultTotal && (
                          <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                            {resultTotal[i] &&
                            typeof resultTotal[i] === "number"
                              ? Math.round(resultTotal[i] * 1000) / 1000
                              : resultTotal[i]}{" "}
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

          <Text style={css.subtitle}>Үр дүн (хэвийн горимд нэг шугамд) : </Text>
          {(() => {
            const data = [
              {
                label: "Нэг шугамаар дамжих чадал",
                unit: "кВт",
              },
              {
                label: "Нэг шугамаар дамжих гүйдэл",
                unit: "А",
              },
              {
                label: "Хэвийн үеийн бүрэн чадал",
                unit: "кВА",
              },
              {
                label: "Шугам тус бүрийн эхэнд тавих автомат таслуурын гүйдэл",
                unit: "A",
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

          <Text style={css.subtitle}>Үр дүн (Нэг хэлхээ тасарсан үед): </Text>
          {(() => {
            let labelCable = "Х/ц хос кабель";
            if (value.cable === "CC") labelCable = "Зэс хос кабель";
            else if (value.cable === "AW") labelCable = "Хос х/ц утас";
            else if (value.cable === "CW") labelCable = "Хос зэс утас";
            else labelCable = "Х/ц хос кабель";
            const data = [
              {
                label:
                  "Нэг шугам тасарсан үеийн нэг шугамаар дамжих тооцооны чадал",
                unit: "кВт",
              },
              {
                label:
                  "Нэг шугам тасарсан үеийн нэг шугамаар дамжих тооцооны гүйдэл",
                unit: "А",
              },
              {
                label: "Нэг шугам тасарсан үеийн шугамын бүрэн чадал",
                unit: "кВА",
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
                        {resultEmergency && (
                          <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                            {resultEmergency[i] &&
                            typeof resultEmergency[i] === "number"
                              ? Math.round(resultEmergency[i] * 1000) / 1000
                              : resultEmergency[i]}{" "}
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

          {value.firePump ? (
            <Text style={css.subtitle}>Галын төхөөрөмжүүд : </Text>
          ) : null}
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
                label: "Бүрэн чадал",
                unit: "кВА",
              },
              {
                label: "Автомат таслуурын гүйдэл",
                unit: "A",
              },
              {
                label: "Галд тэсвэртэй зэс кабель",
                unit: "мм.кв",
              },
            ];
            return value.firePump ? (
              <View>
                <View style={css.modalItem}>
                  <Text
                    style={{ fontFamily: w400, color: main, marginRight: 5 }}
                  >
                    ЦХНА-ны зэрэглэл :
                  </Text>
                  <Text style={{ fontFamily: w400 }}>I</Text>
                </View>
                {data.map(({ label, unit }, i) => {
                  if (resultFire && resultFire[i]) {
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
                        {resultFire && (
                          <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                            {resultFire[i] && typeof resultFire[i] === "number"
                              ? Math.round(resultFire[i] * 1000) / 1000
                              : resultFire[i]}{" "}
                            {unit}
                          </Text>
                        )}
                      </View>
                    );
                  }
                })}
              </View>
            ) : null;
          })()}
        </Modal>
      ) : (
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
            >
              <Text
                style={{
                  fontFamily: w400,
                  color: main,
                  marginRight: 5,
                  flexWrap: "wrap",
                }}
              >
                ЦХНА-ны зэрэглэл :{" "}
              </Text>
              <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>III</Text>
            </Text>
          </View>
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
                label: "Сэнсний нийт чадал",
                value: value.fan?.load,
                unit: "кВт",
              },
              {
                label: "Насосны нийт чадал",
                value: value.pump?.load,
                unit: "кВт",
              },
              {
                label: "Халаах төхөөрөмжийн нийт чадал",
                value: value.heater?.load,
                unit: "кВт",
              },
              {
                label: "Лифтний нийт чадал",
                value: value.lift?.load,
                unit: "кВт",
              },
              {
                label: "Галын насос, сэнсний чадал",
                value: value.firePump,
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
          {value.firePump ? (
            <Text style={css.subtitle}>Галын төхөөрөмжүүд : </Text>
          ) : null}
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
                label: "Бүрэн чадал",
                unit: "кВА",
              },
              {
                label: "Автомат таслуурын гүйдэл",
                unit: "A",
              },
              {
                label: "Галд тэсвэртэй зэс кабель",
                unit: "мм.кв",
              },
            ];
            return value.firePump ? (
              <View>
                <View style={css.modalItem}>
                  <Text
                    style={{ fontFamily: w400, color: main, marginRight: 5 }}
                  >
                    ЦХНА-ны зэрэглэл :
                  </Text>
                  <Text style={{ fontFamily: w400 }}>I</Text>
                </View>
                {data.map(({ label, unit }, i) => {
                  if (resultFire && resultFire[i]) {
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
                        {resultFire && (
                          <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                            {resultFire[i] && typeof resultFire[i] === "number"
                              ? Math.round(resultFire[i] * 1000) / 1000
                              : resultFire[i]}{" "}
                            {unit}
                          </Text>
                        )}
                      </View>
                    );
                  }
                })}
              </View>
            ) : null;
          })()}
        </Modal>
      )}
      <Text style={css.title}>Ерөнхий өгөгдөл</Text>
      <FormPicker
        label="Барилгын давхрын тоо"
        icon="office-building"
        options={layers as any}
        onValueChange={(value: any) => {
          setValue((state) => {
            const copyState = { ...state };
            copyState.floor = value;
            return copyState;
          });
        }}
        value={value.floor}
      />

      <SingleTextInput label="Сууцны тоо" placeholder="100'000-аас бага утга" />

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
        {have ? (
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
            onChangeText={(value) => valueChanger(value, ["pump", "quantity"])}
            checkChangeText={(value) =>
              valueChangerButarhai(value, ["pump", "load"], [0, 1000])
            }
            error={{
              text: "Та 0-1000кВт хүртэл чадлын утга оруулна уу",
              show: error.pump,
            }}
          />
        ) : null}

        {have ? (
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
            onChangeText={(value) => valueChanger(value, ["fan", "quantity"])}
            checkChangeText={(value) =>
              valueChangerButarhai(value, ["fan", "load"], [0, 1000])
            }
            error={{
              text: "Та 0-1000кВт хүртэл чадлын утга оруулна уу",
              show: error.fan,
            }}
          />
        ) : null}

        {have ? (
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
              valueChanger(value, ["heater", "quantity"])
            }
            checkChangeText={(value) =>
              valueChangerButarhai(value, ["heater", "load"], [0, 2000])
            }
            error={{
              text: "Та 0-2000кВт хүртэл чадлын утга оруулна уу",
              show: error.heater,
            }}
          />
        ) : null}

        {have ? (
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
            onChangeText={(value) => valueChanger(value, ["lift", "quantity"])}
            checkChangeText={(value) =>
              valueChangerButarhai(value, ["lift", "load"], [0, 1000])
            }
            error={{
              text: "Та 0-1000кВт хүртэл чадлын утга оруулна уу",
              show: error.lift,
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
        <Switch
          onPress={() => {
            setValue((state) => {
              const copy = { ...state };
              copy.earthSystem = !copy.earthSystem;
              return copy;
            });
          }}
          value={value.earthSystem}
          label={value.earthSystem ? "TN-S систем" : "TT систем"}
          innerText={["TT", "TN-S"]}
        />
      </Animatable.View>
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
