declare namespace LX {
  namespace Dislike{

    type DislikeRules = string
    interface DislikeInfo {
      names: Set<string>
      musicNames: Set<string>
      singerNames: Set<string>
      rules: DislikeRules
    }
    interface DislikeMusicInfo {
      name: string
      singer: string
    }
  }
}
