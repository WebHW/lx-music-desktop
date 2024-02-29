const modules = {
  common: {
    get_env_params: 'get_env_params',
    deeplink: 'deeplink',
    clear_env_params_deeplink: 'clear_env_params_deeplink',
    system_theme_change: 'system_theme_change',
    theme_change: 'theme_change',
    get_system_fonts: 'get_system_fonts',
    get_app_setting: 'get_app_setting',
    set_app_setting: 'set_app_setting',
  },
  winMain: {
    focus: 'focus',
  },

}


export const CMMON_EVENT_NAME = modules.common
export const WIN_MAIN_RENDERER_EVENT_NAME = modules.winMain
