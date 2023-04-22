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

const TestScreen3: FC = () => {
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
      question:
        "Барилга байгууламжийн дотор цахилгааны зураг төсөлд хамгийн их хүчдэлийн алдагдлыг тооцож гаргах нь ямар ач холбогдолтой вэ?",
      songoltuud: [
        "Тухайн барилгын доторх цахилгаан хэрэгслүүд зөвшөөрөгдөх хүчдэлээр ажиллаж чадах эсэхийг шалгах.",
        "Дэд өртөөнөөс барилга хүртэлх гадна шугамын алдагдлын зөвшөөрөгдөх хэмжээг тодорхойлоход шаардлагатай.",
        "Зөвшөөрөгдөх хүчдэлийн алдагдалтай жишихэд хэрэглэнэ.",
      ],
      hariu: 2,
    },
    {
      question:
        "MCCB болон MCB хоорондоо цахилгаан параметрүүдийн хувьд ямар ялгаатай вэ?",
      songoltuud: [
        "Хэвийн салгах тавьцын гүйдлээрээ",
        "Цохилтын гүйдлийн утгаараа",
        "Дээрх хоёр хоёулаа зөв",
      ],
      hariu: 3,
    },
    {
      question:
        "Цахилгаан дамжуулах агаарын шугамуудыг хооронд нь хэдэн градусаар огтлолцохоор төлөвлөх нь хамгийн тохиромжтой вэ?",
      songoltuud: [
        "45-135 градус",
        "Аль болох 60-80 градус дотор байлгавал хамгийн тохиромжтой.",
        "Аль болох ойролцоогоор 90 градустай ойролцоо байлгах.",
      ],
      hariu: 3,
    },
    {
      question:
        "Цахилгаан эрчим хүчний чанар аль параметрүүдээс голчлон хамаарах вэ?",
      songoltuud: [
        "Хэвийн давтамж, хэвийн хүчдэл",
        "Чадлын алдагдал, хэвийн хүчдэл",
        "Хэвийн гүйдэл, хүчдэл",
      ],
      hariu: 1,
    },
    {
      question: "ЦХНА-ны I зэргийн хэрэглэгч нь:",
      songoltuud: [
        "Цахилгаан эрчим хүчээр тасалдахыг зөвшөөрөх хугацаа нь автоматаар сэлгэн залгагчийн ажиллах хугацаагаар хязгаарлагдана.",
        "Хоёр талын тэжээлтэй, автоматаар сэлгэн залгагч бүхий самбараас тэжээгдэх ёстой.",
        "Хоёр ба түүнээс дээш бие биеэ нөөцлөх эх үүсвэрээс тэжээгдэж, автоматаар сэлгэн залгагч бүхий самбараас тэжээгдэх ёстой.",
      ],
      hariu: 1,
    },
    {
      question: "Гэрэлтэлт (Лк) гэж юу вэ?",
      songoltuud: [
        "Тухайн барилга дахь өрөөнөөс хамаарсан зөвшөөрөгдөх гэрлийн урсгалын хэмжээ.",
        "Нэгж талбайд ногдох гэрлийн урсгалын хэмжээ.",
        "Нэгж чадалд оногдох гэрлийн урсгалын хэмжээ.",
      ],
      hariu: 2,
    },
    {
      question:
        "10кВ-ын хүчдэлтэй кабелийг шуудуунд хамгийн багадаа хэдэн метрийн гүнд тавихыг зөвшөөрөх вэ?",
      songoltuud: ["0.7 метр", "1 метр", "0.5 метр"],
      hariu: 1,
    },
    {
      question: "Нойлын дамжуулагчийн гол үүрэг юу вэ?",
      songoltuud: [
        "Тэгш биш хэмтэй системийн илүүдэл цэнэгийг сүлжээ рүү гүйлгэж газардуулах.",
        "Фазын хүчдэлд ажиллах хэрэглэгчийг ажиллуулахын тулд хэлхээг битүүрүүлэх зорилготой.",
        "Дээрх хоёр хоёулаа зөв.",
      ],
      hariu: 3,
    },
    {
      question: "Хүчдэлийн зөвшөөрөгдөх алдагдлыг хэрхэн тогтоох вэ?",
      songoltuud: [
        "Норм дүрэм, стандартаар тогтоож өгнө.",
        "Үүсгүүрийн хүчдэлийн хэлбэлзэл, хэрэглэгчийн зөвшөөрөгдөх хүчдэлийн хэлбийлтээс хамааруулан тооцоогоор олно.",
        "Зөвхөн MNS стандартаар тогтоож өгнө.",
      ],
      hariu: 2,
    },
    {
      question: "Гал эсэргүүцэх системийн ачааллыг :",
      songoltuud: [
        "Тухайн гал эсэргүүцэх системийн тэжээлийн утасны огтлол сонгох, хамгаалах хэрэгслийн гүйдлийг олохоос бусад тохиолдолд ачаалалд оролцуулан тооцохгүй.",
        "Оролтоос бусад хэсгийн тооцоонд заавал оролцуулан тооцох шаардлагатай.",
        "Бүх шалталын тооцоонд оролцуулан тооцно.",
      ],
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

export default TestScreen3;

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
