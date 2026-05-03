import { Dimensions, Text, View } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { sharedEpisodeStyleSheet } from "src/modules/app/episode/shared/SharedEpisodeStyleSheet";

type OutrosGroup = { label: string; items: string[] };

export const BarChartComponent = ({
  dataset,
  maxValue,
  title,
  outros,
}: {
  dataset: Array<barDataItem>;
  maxValue: number;
  title: string;
  outros?: OutrosGroup[];
}) => {
  return (
    <>
      <View
        style={{
          alignSelf: "center",
          padding: 16,
          borderRadius: 9999,
          backgroundColor: "#fbfcfe",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
          {" "}
          {title}{" "}
        </Text>
      </View>

      {dataset && (
        <View
          key={"bar-" + title}
          style={{
            backgroundColor: "#fff",
            paddingBottom: 60,
            paddingTop: 20,
            borderRadius: 25,
            shadowOffset: { width: 3, height: 4 },
            shadowColor: "#ccc",
            shadowOpacity: 0.8,
            zIndex: 20,
          }}
        >
          <BarChart
            key={title}
            barBorderTopRightRadius={4}
            barBorderTopLeftRadius={4}
            barWidth={18}
            data={dataset}
            width={Dimensions.get("window").width - 62}
            showValuesAsTopLabel
            topLabelTextStyle={{ marginTop: -10 }}
            scrollAnimation
            yAxisLabelWidth={10}
            xAxisLabelsVerticalShift={20}
            xAxisLabelTextStyle={{
              minHeight: 20,
              transform: [
                { rotate: "90deg" },
                { translateY: 90 },
                { translateX: 90 },
                { rotate: "180deg" },
              ],
              textAlign: "right",
            }}
            labelWidth={200}
            hideYAxisText
            labelsExtraHeight={150}
            barBorderRadius={20}
            yAxisThickness={1}
            xAxisThickness={1}
            xAxisColor="#ccc"
            yAxisColor="#CCC"
            maxValue={maxValue ? maxValue + 1 : 10}
            barMarginBottom={6}
          />

          {!!outros?.length && (
            <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
              {outros.map((group, gi) =>
                group.items.length > 0 ? (
                  <View
                    key={gi}
                    style={{ marginBottom: gi < outros.length - 1 ? 12 : 0 }}
                  >
                    <Text style={{ fontWeight: "600", marginBottom: 4 }}>
                      {group.label}:
                    </Text>
                    {group.items.map((item, ii) => (
                      <View
                        key={ii}
                        className="h-[43px] rounded-full bg-purple-dark-primary m-2 shrink-0 px-4 justify-center shadow-md"
                      >
                        <Text className="text-white">{item}</Text>
                      </View>
                    ))}
                  </View>
                ) : null,
              )}
            </View>
          )}
        </View>
      )}
    </>
  );
};
