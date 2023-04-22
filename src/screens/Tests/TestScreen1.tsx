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
import CountContext from "../../context/CountContext";

const { width } = Dimensions.get("screen");

const TestScreen1: FC = () => {
  const { increase } = useContext(CountContext);
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

    await increase();
  };

  const tests = [
    {
      question: "Барилгыг зориулалтаар нь юу гэж ангилах вэ?",
      songoltuud: [
        "Орон сууц, олон нийтийн, ХАА-ын, үйлдвэрийн",
        "Иргэний, үйлдвэрийн, тусгай зориулалтын, орон сууцны",
        "Иргэний, үйлдвэрийн, ХАА-ын, тусгай зориулалтын",
        "Иргэний, үйлдвэрийн, ХАА-ын",
      ],
      hariu: 3,
    },
    {
      question:
        "ВА47 маягийн автомат таслууруудын характеристик хоорондоо (B,C,D) юугаараа ялгаатай вэ?",
      songoltuud: [
        "Таслах гүйдлийн хамгийн их утгаар",
        "Цохилтын гүйдэл даах хамгийн их утгаар",
        "Ажиллах хугацаагаар",
        "Туйлын тоогоор",
      ],
      hariu: 3,
    },
    {
      question:
        "Дифференциал автомат, хамгаалалтын таслах төхөөрөмж юугаараа ялгаатай вэ?",
      songoltuud: [
        "Хэлбэр, хэмжээгээрээ",
        "Ажиллах зарчимаараа",
        "Богино, залгаа хэт ачааллаас хамгаалдаг, хамгаалдаггүйгээрээ",
      ],
      hariu: 3,
    },
    {
      question:
        "Утасны хөндлөн огтлолыг халалтын нөхцлөөр сонгохдоо ямар гүйдлээр сонгох вэ?",
      songoltuud: [
        "Автоматын салгах гүйдлээр",
        "Хэвийн гүйдлээр",
        "Тооцооны гүйдлээр",
      ],
      hariu: 1,
    },
    {
      question: "Ачаалал таслагч ВН32-ыг хичнээн туйлтайгаар үйлдвэрлэдэг вэ?",
      songoltuud: ["1,3", "2,4", "1,2,3,4"],
      hariu: 3,
    },
    {
      question:
        "Цахилгаан тоног төхөөрөмжийг хүчдэлийн утгаар нь юу гэж ангилдаг вэ?",
      songoltuud: [
        "Өндөр, нам",
        "1000B-с дээш ба доош",
        "Хуваарилах сүлжээний, орон нутгийн, районы сүлжээний",
      ],
      hariu: 2,
    },
    {
      question:
        "30-н айлын орон сууц цахилгаан хангамжийн найдвартай ажиллагааны хэддүгээр зэргийн хэрэглэгч болох вэ?",
      songoltuud: ["1", "2", "3"],
      hariu: 2,
    },
    {
      question:
        "Орон сууцны барилгын АЦӨ-ний розетканы шугамын эхэнд тавьсан хамгаалалтын таслах төхөөрөмжийн газардлагын гүйдлийн утга хэдэн mA байх вэ?",
      songoltuud: ["10mA", "30mA", "30mA хүртэл"],
      hariu: 3,
    },
    {
      question:
        "Орон сууцны гэрэлтүүлгийн сүлжээний хүчдлийн алдагдал нь ... байх ёстой.",
      songoltuud: [
        "Орон сууцны дотор талд 2.5%-аас ихгүй",
        "Барилгын төрлөөс үл хамааран хамгийн холын гэрэлтүүлэгчийн хавчаар дээрх хүчдэл 2.5%-аас ихгүй",
        "Бүх гэрэлтүүлэгч дээр 2.5%-аас бага",
      ],
      hariu: 2,
    },
    {
      question:
        "Олон нийтийн барилгын гэрэлтүүлгийн тооцоонд шаардлагын коэффициентийг юунаас хамааруулж сонгох вэ?",
      songoltuud: [
        "Гэрэлтүүлэгчийн тоо, барилгын зориулалтаас",
        "Гэрэлтүүлгийн суурилагдсан чадал, гэрлийн тооноос",
        "Гэрэлтүүлгийн суурилагдсан чадал, барилгын зориулалтаас",
      ],
      hariu: 3,
    },
  ];

  useEffect(() => {
    const hariulaagu = hariulsan.findIndex((index) => index === -1);
    if (hariulaagu === -1) {
      if (hariulsan.filter((hariult) => hariult !== undefined).length === 10) {
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
                  if (!shalgasan) return <Text>{songolt}</Text>;
                  else {
                    return i + 1 === tests[index].hariu ? (
                      <Text style={{ backgroundColor: green }}>{songolt}</Text>
                    ) : (
                      <Text>{songolt}</Text>
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

export default TestScreen1;

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
