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
    get_hot_key: 'get_hot_key',
    key_down: 'key_down',
    set_hot_key_config: 'set_hot_key_config',

  },
  player: {
    invoke_play_music: 'play_music',
    invoke_play_next: 'play_next',
    invoke_play_prev: 'play_prev',
    invoke_toggle_play: 'toggle_play',
    player_play: 'player_play',
    player_pause: 'player_pause',
    player_stop: 'player_stop',
    player_error: 'player_error',

    list_data_overwire: 'list_data_overwire',
    list_get: 'list_get',
    list_add: 'list_add',
    list_remove: 'list_remove',
    list_update: 'list_update',
    list_update_position: 'list_update_position',
    list_music_get: 'list_music_get',
    list_music_add: 'list_music_add',
    list_music_move: 'list_music_move',
    list_music_remove: 'list_music_remove',
    list_music_update: 'list_music_update',
    list_music_update_position: 'list_music_update_position',
    list_music_overwrite: 'list_music_overwrite',
    list_music_clear: 'list_music_clear',
    list_music_check_exist: 'list_music_check_exist',
    list_music_get_list_ids: 'list_music_get_list_ids',
  },
  dislike: {
    get_dislike_music_infos: 'get_dislike_music_infos',
    add_dislike_music_infos: 'add_dislike_music_infos',
    overwrite_dislike_music_infos: 'overwrite_dislike_music_infos',
    clear_dislike_music_infos: 'clear_dislike_music_infos',
  },
}


export const CMMON_EVENT_NAME = modules.common
export const PLAYER_EVENT_NAME = modules.player
export const WIN_MAIN_RENDERER_EVENT_NAME = modules.winMain
export const DISLIKE_EVENT_NAME = modules.dislike
