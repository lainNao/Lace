import { useSettingsPanelController } from "../../controllers/settings/useSettingsPanelController";

export const SettingsPanel = () => {
  const controller = useSettingsPanelController();

  console.log(controller.globalSettings)

  return (
    <div>

      <section>
        <h3>根本</h3>
        <div>DBファイル保存フォルダパス</div>
      </section>

      <section>
        <h3>見た目</h3>
        <div>設定言語</div>
      </section>

      {/* TODO
      フォルダ容量最適化
      テーマカラー */}

    </div>
  )
}