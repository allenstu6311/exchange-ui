import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

export interface ITabData {
  label: string;
  index: number;
}

interface CTabsProps {
  tabOnChange: (item: ITabData) => void;
  tabData: ITabData[];
}

function CTabs({ tabOnChange, tabData }: CTabsProps) {
  return (
    <Tabs>
      <TabList>
        {tabData.map((item) => (
          <Tab
            key={item.index}
            onClick={() => {
              tabOnChange(item);
            }}
          >
            {item.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}

export default CTabs;
