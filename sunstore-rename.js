/**
 * Sub-Store 代理节点重命名脚本
 * 更新日期：2025-08-09
 * 
 * 主要功能：
 * - 支持多种节点名称格式转换（中文、英文、国旗、全称）
 * - 自动添加序号和前缀
 * - 过滤和保留特定关键词
 * - 支持倍率标识处理
 */

// ===== 常量定义 =====
const DEFAULT_SEPARATOR = " ";
const DEFAULT_NUMBER_SEPARATOR = " ";
const SEQUENCE_NUMBER_PAD_LENGTH = 2;

// 国家/地区数据映射
const COUNTRY_FLAGS = ['🇭🇰','🇲🇴','🇹🇼','🇯🇵','🇰🇷','🇸🇬','🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇦🇺','🇦🇪','🇦🇫','🇦🇱','🇩🇿','🇦🇴','🇦🇷','🇦🇲','🇦🇹','🇦🇿','🇧🇭','🇧🇩','🇧🇾','🇧🇪','🇧🇿','🇧🇯','🇧🇹','🇧🇴','🇧🇦','🇧🇼','🇧🇷','🇻🇬','🇧🇳','🇧🇬','🇧🇫','🇧🇮','🇰🇭','🇨🇲','🇨🇦','🇨🇻','🇰🇾','🇨🇫','🇹🇩','🇨🇱','🇨🇴','🇰🇲','🇨🇬','🇨🇩','🇨🇷','🇭🇷','🇨🇾','🇨🇿','🇩🇰','🇩🇯','🇩🇴','🇪🇨','🇪🇬','🇸🇻','🇬🇶','🇪🇷','🇪🇪','🇪🇹','🇫🇯','🇫🇮','🇬🇦','🇬🇲','🇬🇪','🇬🇭','🇬🇷','🇬🇱','🇬🇹','🇬🇳','🇬🇾','🇭🇹','🇭🇳','🇭🇺','🇮🇸','🇮🇳','🇮🇩','🇮🇷','🇮🇶','🇮🇪','🇮🇲','🇮🇱','🇮🇹','🇨🇮','🇯🇲','🇯🇴','🇰🇿','🇰🇪','🇰🇼','🇰🇬','🇱🇦','🇱🇻','🇱🇧','🇱🇸','🇱🇷','🇱🇾','🇱🇹','🇱🇺','🇲🇰','🇲🇬','🇲🇼','🇲🇾','🇲🇻','🇲🇱','🇲🇹','🇲🇷','🇲🇺','🇲🇽','🇲🇩','🇲🇨','🇲🇳','🇲🇪','🇲🇦','🇲🇿','🇲🇲','🇳🇦','🇳🇵','🇳🇱','🇳🇿','🇳🇮','🇳🇪','🇳🇬','🇰🇵','🇳🇴','🇴🇲','🇵🇰','🇵🇦','🇵🇾','🇵🇪','🇵🇭','🇵🇹','🇵🇷','🇶🇦','🇷🇴','🇷🇺','🇷🇼','🇸🇲','🇸🇦','🇸🇳','🇷🇸','🇸🇱','🇸🇰','🇸🇮','🇸🇴','🇿🇦','🇪🇸','🇱🇰','🇸🇩','🇸🇷','🇸🇿','🇸🇪','🇨🇭','🇸🇾','🇹🇯','🇹🇿','🇹🇭','🇹🇬','🇹🇴','🇹🇹','🇹🇳','🇹🇷','🇹🇲','🇻🇮','🇺🇬','🇺🇦','🇺🇾','🇺🇿','🇻🇪','🇻🇳','🇾🇪','🇿🇲','🇿🇼','🇦🇩','🇷🇪','🇵🇱','🇬🇺','🇻🇦','🇱🇮','🇨🇼','🇸🇨','🇦🇶','🇬🇮','🇨🇺','🇫🇴','🇦🇽','🇧🇲','🇹🇱'];

const COUNTRY_CODES_EN = ['HK','MO','TW','JP','KR','SG','US','GB','FR','DE','AU','AE','AF','AL','DZ','AO','AR','AM','AT','AZ','BH','BD','BY','BE','BZ','BJ','BT','BO','BA','BW','BR','VG','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CO','KM','CG','CD','CR','HR','CY','CZ','DK','DJ','DO','EC','EG','SV','GQ','ER','EE','ET','FJ','FI','GA','GM','GE','GH','GR','GL','GT','GN','GY','HT','HN','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','CI','JM','JO','KZ','KE','KW','KG','LA','LV','LB','LS','LR','LY','LT','LU','MK','MG','MW','MY','MV','ML','MT','MR','MU','MX','MD','MC','MN','ME','MA','MZ','MM','NA','NP','NL','NZ','NI','NE','NG','KP','NO','OM','PK','PA','PY','PE','PH','PT','PR','QA','RO','RU','RW','SM','SA','SN','RS','SL','SK','SI','SO','ZA','ES','LK','SD','SR','SZ','SE','CH','SY','TJ','TZ','TH','TG','TO','TT','TN','TR','TM','VI','UG','UA','UY','UZ','VE','VN','YE','ZM','ZW','AD','RE','PL','GU','VA','LI','CW','SC','AQ','GI','CU','FO','AX','BM','TL'];

const COUNTRY_NAMES_ZH = ['香港','澳门','台湾','日本','韩国','新加坡','美国','英国','法国','德国','澳大利亚','阿联酋','阿富汗','阿尔巴尼亚','阿尔及利亚','安哥拉','阿根廷','亚美尼亚','奥地利','阿塞拜疆','巴林','孟加拉国','白俄罗斯','比利时','伯利兹','贝宁','不丹','玻利维亚','波斯尼亚和黑塞哥维那','博茨瓦纳','巴西','英属维京群岛','文莱','保加利亚','布基纳法索','布隆迪','柬埔寨','喀麦隆','加拿大','佛得角','开曼群岛','中非共和国','乍得','智利','哥伦比亚','科摩罗','刚果(布)','刚果(金)','哥斯达黎加','克罗地亚','塞浦路斯','捷克','丹麦','吉布提','多米尼加共和国','厄瓜多尔','埃及','萨尔瓦多','赤道几内亚','厄立特里亚','爱沙尼亚','埃塞俄比亚','斐济','芬兰','加蓬','冈比亚','格鲁吉亚','加纳','希腊','格陵兰','危地马拉','几内亚','圭亚那','海地','洪都拉斯','匈牙利','冰岛','印度','印尼','伊朗','伊拉克','爱尔兰','马恩岛','以色列','意大利','科特迪瓦','牙买加','约旦','哈萨克斯坦','肯尼亚','科威特','吉尔吉斯斯坦','老挝','拉脱维亚','黎巴嫩','莱索托','利比里亚','利比亚','立陶宛','卢森堡','马其顿','马达加斯加','马拉维','马来','马尔代夫','马里','马耳他','毛利塔尼亚','毛里求斯','墨西哥','摩尔多瓦','摩纳哥','蒙古','黑山共和国','摩洛哥','莫桑比克','缅甸','纳米比亚','尼泊尔','荷兰','新西兰','尼加拉瓜','尼日尔','尼日利亚','朝鲜','挪威','阿曼','巴基斯坦','巴拿马','巴拉圭','秘鲁','菲律宾','葡萄牙','波多黎各','卡塔尔','罗马尼亚','俄罗斯','卢旺达','圣马力诺','沙特阿拉伯','塞内加尔','塞尔维亚','塞拉利昂','斯洛伐克','斯洛文尼亚','索马里','南非','西班牙','斯里兰卡','苏丹','苏里南','斯威士兰','瑞典','瑞士','叙利亚','塔吉克斯坦','坦桑尼亚','泰国','多哥','汤加','特立尼达和多巴哥','突尼斯','土耳其','土库曼斯坦','美属维尔京群岛','乌干达','乌克兰','乌拉圭','乌兹别克斯坦','委内瑞拉','越南','也门','赞比亚','津巴布韦','安道尔','留尼汪','波兰','关岛','梵蒂冈','列支敦士登','库拉索','塞舌尔','南极','直布罗陀','古巴','法罗群岛','奥兰群岛','百慕达','东帝汶'];

const COUNTRY_NAMES_FULL = ['Hong Kong','Macao','Taiwan','Japan','Korea','Singapore','United States','United Kingdom','France','Germany','Australia','Dubai','Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Austria','Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','British Virgin Islands','Brunei','Bulgaria','Burkina-faso','Burundi','Cambodia','Cameroon','Canada','CapeVerde','CaymanIslands','Central African Republic','Chad','Chile','Colombia','Comoros','Congo-Brazzaville','Congo-Kinshasa','CostaRica','Croatia','Cyprus','Czech Republic','Denmark','Djibouti','Dominican Republic','Ecuador','Egypt','EISalvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','Gabon','Gambia','Georgia','Ghana','Greece','Greenland','Guatemala','Guinea','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Ivory Coast','Jamaica','Jordan','Kazakstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar(Burma)','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','NorthKorea','Norway','Oman','Pakistan','Panama','Paraguay','Peru','Philippines','Portugal','PuertoRico','Qatar','Romania','Russia','Rwanda','SanMarino','SaudiArabia','Senegal','Serbia','SierraLeone','Slovakia','Slovenia','Somalia','SouthAfrica','Spain','SriLanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Tajikstan','Tanzania','Thailand','Togo','Tonga','TrinidadandTobago','Tunisia','Turkey','Turkmenistan','U.S.Virgin Islands','Uganda','Ukraine','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Andorra','Reunion','Poland','Guam','Vatican','Liechtensteins','Curacao','Seychelles','Antarctica','Gibraltar','Cuba','Faroe Islands','Ahvenanmaa','Bermuda','Timor-Leste'];

// 正则表达式定义
const REGEX_PATTERNS = {
  // 特殊标识匹配
  specialRegex: [
    /(\d\.)?\d+×/,
    /IPLC|IEPL|Kern|Edge|Pro|Std|Exp|Biz|Fam|Game|Buy|Zx|LB|Game/,
  ],
  
  // 无效名称清理
  nameClearRegex: /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL)/i,
  
  // 倍率匹配
  multiplierRegex: [/ˣ²/, /ˣ³/, /ˣ⁴/, /ˣ⁵/, /ˣ⁶/, /ˣ⁷/, /ˣ⁸/, /ˣ⁹/, /ˣ¹⁰/, /ˣ²⁰/, /ˣ³⁰/, /ˣ⁴⁰/, /ˣ⁵⁰/, /IPLC/i, /IEPL/i, /核心/, /边缘/, /高级/, /标准/, /实验/, /商宽/, /家宽/, /游戏|game/i, /购物/, /专线/, /LB/, /cloudflare/i, /\budp\b/i, /\bgpt\b/i,/udpn\b/],
  
  // 高倍率标识
  highMultiplierRegex: /(高倍|(?!1)2+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i,
  
  // 倍率标识
  anyMultiplierRegex: /(高倍|(?!1)(0\.|\d)+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i,
  
  // 关键节点匹配
  keyNodeRegexA: /港|Hong|HK|新加坡|SG|Singapore|日本|Japan|JP|美国|United States|US|韩|土耳其|TR|Turkey|Korea|KR|🇸🇬|🇭🇰|🇯🇵|🇺🇸|🇰🇷|🇹🇷/i,
  
  keyNodeRegexB: /(((1|2|3|4)\d)|(香港|Hong|HK) 0[5-9]|((新加坡|SG|Singapore|日本|Japan|JP|美国|United States|US|韩|土耳其|TR|Turkey|Korea|KR) 0[3-9]))/i,
  
  // 倍率提取
  rateExtractionRegex: /((倍率|X|x|×)\D?((\d{1,3}\.)?\d+)\D?)|((\d{1,3}\.)?\d+)(倍|X|x|×)/
};

// 倍率对应值
const MULTIPLIER_VALUES = ["2×","3×","4×","5×","6×","7×","8×","9×","10×","20×","30×","40×","50×","IPLC","IEPL","Kern","Edge","Pro","Std","Exp","Biz","Fam","Game","Buy","Zx","LB","CF","UDP","GPT","UDPN"];

// 地区名称规则替换映射
const REGION_NAME_RULES = {
  GB: /UK/g,
  "B-G-P": /BGP/g,
  "Russia Moscow": /Moscow/g,
  "Korea Chuncheon": /Chuncheon|Seoul/g,
  "Hong Kong": /Hongkong|HONG KONG/gi,
  "United Kingdom London": /London|Great Britain/g,
  "Dubai United Arab Emirates": /United Arab Emirates/g,
  "Taiwan TW 台湾 🇹🇼": /(台|Tai\s?wan|TW).*?🇨🇳|🇨🇳.*?(台|Tai\s?wan|TW)/g,
  "United States": /USA|Los Angeles|San Jose|Silicon Valley|Michigan/g,
  澳大利亚: /澳洲|墨尔本|悉尼|土澳|(深|沪|呼|京|广|杭)澳/g,
  德国: /(深|沪|呼|京|广|杭)德(?!.*(I|线))|法兰克福|滬德/g,
  香港: /(深|沪|呼|京|广|杭)港(?!.*(I|线))/g,
  日本: /(深|沪|呼|京|广|杭|中|辽)日(?!.*(I|线))|东京|大坂/g,
  新加坡: /狮城|(深|沪|呼|京|广|杭)新/g,
  美国: /(深|沪|呼|京|广|杭)美|波特兰|芝加哥|哥伦布|纽约|硅谷|俄勒冈|西雅图|芝加哥/g,
  波斯尼亚和黑塞哥维那: /波黑共和国/g,
  印尼: /印度尼西亚|雅加达/g,
  印度: /孟买/g,
  阿联酋: /迪拜|阿拉伯联合酋长国/g,
  孟加拉国: /孟加拉/g,
  捷克: /捷克共和国/g,
  台湾: /新台|新北|台(?!.*线)/g,
  Taiwan: /Taipei/g,
  韩国: /春川|韩|首尔/g,
  Japan: /Tokyo|Osaka/g,
  英国: /伦敦/g,
  India: /Mumbai/g,
  Germany: /Frankfurt/g,
  Switzerland: /Zurich/g,
  俄罗斯: /莫斯科/g,
  土耳其: /伊斯坦布尔/g,
  泰国: /泰國|曼谷/g,
  法国: /巴黎/g,
  G: /\d\s?GB/gi,
  Esnc: /esnc/gi,
};

// ===== 配置类 =====
class RenameConfig {
  constructor(inputArgs) {
    // 解析输入参数
    const args = inputArgs || {};
    
    // 基础功能开关
    this.preserveNoMultiplier = args.nx || false;
    this.preserveMultiplier = args.bl || false;
    this.nameFirst = args.nf || false;
    this.keyFilter = args.key || false;
    this.preserveGameGrade = args.blgd || false;
    this.sortByMultiplier = args.blpx || false;
    this.preserveHighMultiplier = args.blnx || false;
    this.removeOneNumber = args.one || false;
    this.debug = args.debug || false;
    this.clearInvalidNames = args.clear || false;
    this.addFlag = args.flag || false;
    this.preserveUnmatched = args.nm || false;

    // 分隔符配置
    this.flagSeparator = args.fgf === undefined ? DEFAULT_SEPARATOR : decodeURI(args.fgf);
    this.numberSeparator = args.sn === undefined ? DEFAULT_NUMBER_SEPARATOR : decodeURI(args.sn);
    
    // 前缀和关键词配置
    this.namePrefix = args.name === undefined ? "" : decodeURI(args.name);
    this.preserveKeywords = args.blkey === undefined ? "" : decodeURI(args.blkey);
    this.blockQuic = args.blockquic === undefined ? "" : decodeURI(args.blockquic);
    
    // 名称映射配置
    const nameMapping = {
      cn: "cn", zh: "cn",
      us: "us", en: "us",
      quan: "quan",
      gq: "gq", flag: "gq",
    };
    
    this.inputNameType = nameMapping[args.in] || "";
    this.outputNameType = nameMapping[args.out] || "";
  }
}

// ===== 国家映射管理类 =====
class CountryMapper {
  constructor() {
    this.countryMappings = {};
    this.isInitialized = false;
    this.mappingEntries = [];
  }

  /**
   * 根据输出类型获取对应的国家列表
   * @param {string} type - 输出类型
   * @returns {Array} 国家列表
   */
  getCountryList(type) {
    switch (type) {
      case 'us': return COUNTRY_CODES_EN;
      case 'gq': return COUNTRY_FLAGS;
      case 'quan': return COUNTRY_NAMES_FULL;
      default: return COUNTRY_NAMES_ZH;
    }
  }

  /**
   * 初始化国家映射关系
   * @param {string} inputType - 输入类型
   * @param {string} outputType - 输出类型
   */
  initializeMappings(inputType, outputType) {
    if (this.isInitialized) return;

    const outputList = this.getCountryList(outputType);
    let inputLists;

    if (inputType !== "") {
      inputLists = [this.getCountryList(inputType)];
    } else {
      // 自动判断，优先级：中文 -> 国旗 -> 英文全称 -> 英文简写
      inputLists = [COUNTRY_NAMES_ZH, COUNTRY_FLAGS, COUNTRY_NAMES_FULL, COUNTRY_CODES_EN];
    }

    // 建立映射关系
    inputLists.forEach((inputList) => {
      inputList.forEach((value, index) => {
        this.countryMappings[value] = outputList[index];
      });
    });

    this.mappingEntries = Object.entries(this.countryMappings);
    this.isInitialized = true;
  }

  /**
   * 查找匹配的国家映射
   * @param {string} name - 节点名称
   * @returns {string|null} 匹配的国家名称
   */
  findCountryMatch(name) {
    const match = this.mappingEntries.find(([key]) => name.includes(key));
    return match ? match[1] : null;
  }
}

// ===== 代理节点重命名器 =====
class ProxyRenamer {
  constructor(config) {
    this.config = config;
    this.countryMapper = new CountryMapper();
  }

  /**
   * 主要的重命名处理函数
   * @param {Array} proxyList - 代理节点列表
   * @returns {Array} 处理后的代理节点列表
   */
  rename(proxyList) {
    // 初始化映射关系
    this.countryMapper.initializeMappings(
      this.config.inputNameType, 
      this.config.outputNameType
    );

    // 过滤节点
    let filteredProxies = this.filterProxies(proxyList);
    
    // 处理节点名称
    let processedProxies = this.processProxyNames(filteredProxies);
    
    // 移除无效节点
    processedProxies = processedProxies.filter(proxy => proxy.name !== null);
    
    // 添加序号
    this.addSequenceNumbers(processedProxies);
    
    // 清理单节点地区的序号
    if (this.config.removeOneNumber) {
      this.removeSingleNodeNumbers(processedProxies);
    }
    
    // 按倍率排序
    if (this.config.sortByMultiplier) {
      processedProxies = this.sortProxiesByMultiplier(processedProxies);
    }
    
    // 关键节点过滤
    if (this.config.keyFilter) {
      processedProxies = processedProxies.filter(proxy => 
        !REGEX_PATTERNS.keyNodeRegexB.test(proxy.name)
      );
    }

    return processedProxies;
  }

  /**
   * 过滤代理节点
   * @param {Array} proxyList - 代理节点列表
   * @returns {Array} 过滤后的列表
   */
  filterProxies(proxyList) {
    return proxyList.filter(proxy => {
      const name = proxy.name;
      
      // 清理无效名称
      if (this.config.clearInvalidNames && REGEX_PATTERNS.nameClearRegex.test(name)) {
        return false;
      }
      
      // 保留无倍率节点
      if (this.config.preserveNoMultiplier && REGEX_PATTERNS.anyMultiplierRegex.test(name)) {
        return false;
      }
      
      // 只保留高倍率节点
      if (this.config.preserveHighMultiplier && !REGEX_PATTERNS.highMultiplierRegex.test(name)) {
        return false;
      }
      
      // 关键节点过滤
      if (this.config.keyFilter && 
          !(REGEX_PATTERNS.keyNodeRegexA.test(name) && /2|4|6|7/i.test(name))) {
        return false;
      }

      return true;
    });
  }

  /**
   * 处理代理节点名称
   * @param {Array} proxyList - 代理节点列表
   * @returns {Array} 处理后的列表
   */
  processProxyNames(proxyList) {
    return proxyList.map(proxy => {
      let retainedKeywords = "";
      let originalName = proxy.name;
      let hasKeywordMatch = false;

      // 预处理地区名称规则
      Object.keys(REGION_NAME_RULES).forEach(replacement => {
        const regex = REGION_NAME_RULES[replacement];
        if (regex.test(proxy.name
