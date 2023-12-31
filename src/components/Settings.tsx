import { Field } from "@/components/Field";
import { RadioGroup } from "@/components/RadioGroup";
import { Switch } from "@/components/Switch";
import { Toggle } from "@/components/Toggle";
import { Popover } from "@/components/Popover";
import { LanguageSelect } from "@/components/LanguageSelect";
import { About } from "@/components/About";

import { useStorage } from "@/hooks/useStorage";
import { useTranslation } from "@/hooks/useTranslation";

import { Settings as SettingsType } from "@/config/types";

import { canVibrate } from "@/modules/vibrator";

export interface SettingsProps {
  isVisible: boolean;
}

export function Settings({ isVisible }: SettingsProps) {
  const { t } = useTranslation();

  const [vibration, setVibration] = useStorage("vibration");
  const [guide, setGuide] = useStorage("guide");
  const [theme, setTheme] = useStorage("theme");

  return (
    <Popover isVisible={isVisible}>
      {canVibrate && (
        <Field
          id="vibration"
          label={t("settings.vibration.title")}
          description={t("settings.vibration.description")}
        >
          <Switch id="vibration" value={vibration} onChange={setVibration} />
        </Field>
      )}
      <Field
        id="guide"
        label={t("settings.guide.title")}
        description={
          guide === "disabled"
            ? t("settings.guide.disabled")
            : t("settings.guide.enabled")
        }
        children={
          <Switch
            id="guide"
            value={guide !== "disabled"}
            onChange={(selected) => setGuide(selected ? "female" : "disabled")}
          />
        }
        bottom={
          guide !== "disabled" && (
            <RadioGroup<SettingsType["guide"]>
              name="guide"
              value={guide}
              onChange={setGuide}
              options={[
                { label: t("settings.guide.options.female"), value: "female" },
                { label: t("settings.guide.options.male"), value: "male" },
                { label: t("settings.guide.options.bell"), value: "bell" },
              ]}
            />
          )
        }
      />
      <Field
        id="theme"
        label={t("settings.theme.title")}
        bottom={
          <Toggle<SettingsType["theme"]>
            id="theme"
            name="theme"
            value={theme}
            onChange={setTheme}
            options={[
              {
                label: t("settings.theme.system"),
                value: "system",
              },
              {
                label: t("settings.theme.dark"),
                value: "dark",
              },
              {
                label: t("settings.theme.light"),
                value: "light",
              },
            ]}
          />
        }
      />
      <LanguageSelect />
      <About />
    </Popover>
  );
}
