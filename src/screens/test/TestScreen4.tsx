import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from "react-native";
import React, { FC, useEffect, useState, useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { dark, main, w500 } from "../../constants";
import Button from "../../components/Button";

const { width } = Dimensions.get("screen");

const TestScreen4: FC = () => {
  const [hariulsan, setHariulsan] = useState<number[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [shalgasan, setShalgasan] = useState<boolean>(false);
  const [zowHariulsan, setZowHariulsan] = useState<boolean[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);

  const utgaUurchluh = (a: number, i: number) => {
    setHariulsan((state) => {
      const copyState = [...state];
      if (copyState[a] === i) {
        copyState[a] = -1;
      } else {
        copyState[a] = i;
      }

      return copyState;
    });
  };

  useEffect(() => {
    tests.map((el, i) => {
      setZowHariulsan((state) => {
        const copy = [...state];

        copy[i] = hariulsan[i] + 1 === tests[i].hariu;
        return copy;
      });
    });
  }, [hariulsan]);

  useEffect(() => {
    const scores: number[] = [];

    zowHariulsan.map((el, i) =>
      el === false ? (scores[i] = 0) : (scores[i] = 1)
    );

    setTotalScore(() => {
      const total = scores.reduce((a, b) => a + b, 0);
      return total;
    });
  }, [hariulsan, zowHariulsan]);

  const clicked = async () => {
    setShalgasan(!shalgasan);
    let dvn = "";
    if (totalScore < 6) dvn = "F";
    else if (totalScore < 7) dvn = "D";
    else if (totalScore < 8) dvn = "C";
    else if (totalScore < 9) dvn = "B";
    else dvn = "A";

    if (shalgasan) {
      setHariulsan(() => []);
    } else {
      Alert.alert(
        `Таны дүн : ${dvn}`,
        `Та 10-н асуултаас ${totalScore} асуултанд зөв хариулсан байна.`,
        [
          {
            text: "Ойлгосон",
            onPress: () => {},
            style: "cancel",
          },
        ]
      );
    }
  };

  const tests = [
    {
      question: "II зэргийн хэрэглэгчидийг нэг шугамаар тэжээж болох уу?",
      songoltuud: [
        "1-ээс дээш тэжээлийн үүсгүүртэй байх боломж хомс газарт ослын засварын хугацаа зөвшөөрөгдөх хэмжээнд байх бол зөвшөөрнө.",
        "Дизель генертар, тог баригч гэх мэт шийдлээр заавал нөөц эх үүсвэрийн асуудлыг шийдвэрлэх тохиолдолд зөвшөөрнө.",
        "Зөвшөөрөхгүй.",
      ],
      hariu: 1,
    },
    {
      question:
        "Орон сууцны доторх хоёрлосон розеткыг хэдэн розеткаар тооцох вэ?",
      songoltuud: [
        "Нэг розетка",
        "Хоёр розетка",
        "Гал тогооны хэсгээс бусад хэсэгт нэг розеткаар",
        "Гал тогооны хэсгээс бусад хэсэгт хоёр розеткаар",
      ],
      hariu: 3,
    },
    {
      question: "Нэг шуудуунд хичнээн хүчний кабель хамт хийхийг зөвшөөрөх вэ?",
      songoltuud: ["2", "4", "6"],
      hariu: 3,
    },
    {
      question: "Идэвхитэй чадал гэж юу вэ?",
      songoltuud: [
        "Цахилгаан энергийг идэвхитэй чадал гэнэ.",
        "Гүйдэл хүчдэлийн үржвэрийг идэвхитэй чадал гэнэ.",
        "Цахилгааны энергийг бусад төрлийн энерги рүү хувиргахад шаардагдах цахилгаан энерги зарцуулалтын хурдыг идэвхитэй чадал гэнэ.",
      ],
      hariu: 3,
    },
    {
      question:
        "Орон сууцны барилгад периметрийн дагуу хэдэн метр тутамд розетка тоноглох вэ?",
      songoltuud: [
        "4 метр тутамд",
        "6 метр тутамд",
        "Периметрийн дагуу биш талбайн хэмжээнээс хамааруулж 6м2 талбай тутамд бодож тоноглоно.",
      ],
      hariu: 1,
    },
    {
      question:
        "Чадлын итгэлцүүрийн (cosф) ф өнцөг векторын диаграм дээр ямар параметрүүдийн хооронд үүссэн өнцөг вэ?",
      songoltuud: [
        "Идэвхитэй чадал хуурмаг чадлын хооронд үүссэн өнцөг.",
        "Хуурмаг чадал бүрэн чадлын хооронд үүссэн өнцөг.",
        "Идэвхитэй чадал бүрэн чадлын хооронд үүссэн өнцөг",
      ],
      hariu: 3,
    },
    {
      question:
        "Орон сууцны барилгын сантехникийн тоног төхөөрөмжийн чадлын коэффициентийг тооцоонд хэдээр авах вэ?",
      songoltuud: ["0.9", "0.85", "0.8"],
      hariu: 3,
    },
    {
      question:
        "Тооцоогоор 63А автомат тавих шаардлагатай бол ВА88-33, ВА88-32, ВА47-100, ВА47-29 зэргээс аль төрлийн автоматыг нь сонгож тавихаа хэрхэн шийдвэрлэх вэ?",
      songoltuud: [
        "Барилгын дотоод сүлжээний аль шатлалд тавьж байгаагаас хамааруулан сонгоно.",
        "Тухайн автомат тавих хэсэгт богино залгааны тооцоо хийж эдгээр автоматуудын таслах цохилтын гүйдлийн утгаас ихгүй байхаар сонгож тавина.",
        "ВА47-100 юм уу эсвэл ВА88-32 автомат сонгож тавина.",
      ],
      hariu: 2,
    },
    {
      question:
        "Хөдөлгүүрийн хүчдэлийн зөвшөөрөгдөх хэлбийлт хэдэн хувь байх вэ?",
      songoltuud: ["-5%-аас +5%", "-5%-аас +10%", "-2.5%-аас +5%"],
      hariu: 2,
    },
    {
      question:
        "Лифтний тоног төхөөрөмжийн чадлын коэффициентийг хэдээр авч тооцдог вэ?",
      songoltuud: ["0.65", "0.75", "0.85"],
      hariu: 1,
    },
  ];

  useEffect(() => {
    const hariulaagu = hariulsan.findIndex((index) => index === -1);
    if (hariulaagu === -1) {
      if (hariulsan.length === 10) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      setDisabled(true);
    }
  }, [hariulsan]);

  return (
    <ScrollView style={css.container}>
      {tests.map((test, index) => (
        <View key={index} style={css.item}>
          <Text style={css.question}>{test.question}</Text>
          <View>
            {test.songoltuud.map((songolt, i) => (
              <TouchableOpacity
                disabled={shalgasan}
                key={i}
                style={css.songolt}
                activeOpacity={0.7}
                onPress={() => utgaUurchluh(index, i)}
              >
                <MaterialCommunityIcons
                  name={
                    hariulsan[index] === i
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={22}
                  color={hariulsan[index] === i ? main : dark}
                />
                {(() => {
                  const green = "#a4e170";
                  if (!shalgasan)
                    return (
                      <Text style={{ marginHorizontal: 10 }}>{songolt}</Text>
                    );
                  else {
                    return i + 1 === tests[index].hariu ? (
                      <Text
                        style={{ marginHorizontal: 10, backgroundColor: green }}
                      >
                        {songolt}
                      </Text>
                    ) : (
                      <Text style={{ marginHorizontal: 10 }}>{songolt}</Text>
                    );
                  }
                })()}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <Button disable={disabled} onPress={clicked}>
        {!shalgasan ? "Хариултаа шалгах" : "Эхлэх"}
      </Button>
      <View style={{ marginBottom: 30 }}></View>
    </ScrollView>
  );
};

export default TestScreen4;

const css = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  item: {
    marginVertical: 10,
  },
  question: {
    color: main,
    fontSize: 18,
    width: width - 20,
    fontFamily: w500,
  },
  songolt: {
    marginVertical: 5,
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
  },
});
