/**
 * Sub-Store 代理节点重命名脚本
 * @version 2.1.0 (增强版 - 支持特殊标识保留)
 * @description 一个经过重构的、用于Sub-Store的代理节点重命名脚本，支持保留特殊描述标识。
 * @author Gemini
 * @last-updated 2025-08-09
 *
 * 主要功能：
 * - 支持多种节点名称格式转换（中文、英文、国旗、全称）。
 * - 自动添加序号和前缀。
 * - 过滤和保留特定关键词。
 * - 支持倍率标识处理和排序。
 * - 保留特殊描述标识（如IPv6、IEPL、GPT等）。
 */

// ===== 常量定义 (CONSTANTS) =====
const DEFAULT_SEPARATOR = " ";
const DEFAULT_NUMBER_SEPARATOR = " ";
const SEQUENCE_NUMBER_PAD_LENGTH = 2;

// 国家/地区数据
const COUNTRY_DATA = {
    FLAGS: ['🇭🇰','🇲🇴','🇹🇼','🇯🇵','🇰🇷','🇸🇬','🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇦🇺','🇦🇪','🇦🇫','🇦🇱','🇩🇿','🇦🇴','🇦🇷','🇦🇲','🇦🇹','🇦🇿','🇧🇭','🇧🇩','🇧🇾','🇧🇪','🇧🇿','🇧🇯','🇧🇹','🇧🇴','🇧🇦','🇧🇼','🇧🇷','🇻🇬','🇧🇳','🇧🇬','🇧🇫','🇧🇮','🇰🇭','🇨🇲','🇨🇦','🇨🇻','🇰🇾','🇨🇫','🇹🇩','🇨🇱','🇨🇴','🇰🇲','🇨🇬','🇨🇩','🇨🇷','🇭🇷','🇨🇾','🇨🇿','🇩🇰','🇩🇯','🇩🇴','🇪🇨','🇪🇬','🇸🇻','🇬🇶','🇪🇷','🇪🇪','🇪🇹','🇫🇯','🇫🇮','🇬🇦','🇬🇲','🇬🇪','🇬🇭','🇬🇷','🇬🇱','🇬🇹','🇬🇳','🇬🇾','🇭🇹','🇭🇳','🇭🇺','🇮🇸','🇮🇳','🇮🇩','🇮🇷','🇮🇶','🇮🇪','🇮🇲','🇮🇱','🇮🇹','🇨🇮','🇯🇲','🇯🇴','🇰🇿','🇰🇪','🇰🇼','🇰🇬','🇱🇦','🇱🇻','🇱🇧','🇱🇸','🇱🇷','🇱🇾','🇱🇹','🇱🇺','🇲🇰','🇲🇬','🇲🇼','🇲🇾','🇲🇻','🇲🇱','🇲🇹','🇲🇷','🇲🇺','🇲🇽','🇲🇩','🇲🇨','🇲🇳','🇲🇪','🇲🇦','🇲🇿','🇲🇲','🇳🇦','🇳🇵','🇳🇱','🇳🇿','🇳🇮','🇳🇪','🇳🇬','🇰🇵','🇳🇴','🇴🇲','🇵🇰','🇵🇦','🇵🇾','🇵🇪','🇵🇭','🇵🇹','🇵🇷','🇶🇦','🇷🇴','🇷🇺','🇷🇼','🇸🇲','🇸🇦','🇸🇳','🇷🇸','🇸🇱','🇸🇰','🇸🇮','🇸🇴','🇿🇦','🇪🇸','🇱🇰','🇸🇩','🇸🇷','🇸🇿','🇸🇪','🇨🇭','🇸🇾','🇹🇯','🇹🇿','🇹🇭','🇹🇬','🇹🇴','🇹🇹','🇹🇳','🇹🇷','🇹🇲','🇻🇮','🇺🇬','🇺🇦','🇺🇾','🇺🇿','🇻🇪','🇻🇳','🇾🇪','🇿🇲','🇿🇼','🇦🇩','🇷🇪','🇵🇱','🇬🇺','🇻🇦','🇱🇮','🇨🇼','🇸🇨','🇦🇶','🇬🇮','🇨🇺','🇫🇴','🇦🇽','🇧🇲','🇹🇱'],
    CODES_EN: ['HK','MO','TW','JP','KR','SG','US','GB','FR','DE','AU','AE','AF','AL','DZ','AO','AR','AM','AT','AZ','BH','BD','BY','BE','BZ','BJ','BT','BO','BA','BW','BR','VG','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CO','KM','CG','CD','CR','HR','CY','CZ','DK','DJ','DO','EC','EG','SV','GQ','ER','EE','ET','FJ','FI','GA','GM','GE','GH','GR','GL','GT','GN','GY','HT','HN','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','CI','JM','JO','KZ','KE','KW','KG','LA','LV','LB','LS','LR','LY','LT','LU','MK','MG','MW','MY','MV','ML','MT','MR','MU','MX','MD','MC','MN','ME','MA','MZ','MM','NA','NP','NL','NZ','NI','NE','NG','KP','NO','OM','PK','PA','PY','PE','PH','PT','PR','QA','RO','RU','RW','SM','SA','SN','RS','SL','SK','SI','SO','ZA','ES','LK','SD','SR','SZ','SE','CH','SY','TJ','TZ','TH','TG','TO','TT','TN','TR','TM','VI','UG','UA','UY','UZ','VE','VN','YE','ZM','ZW','AD','RE','PL','GU','VA','LI','CW','SC','AQ','GI','CU','FO','AX','BM','TL'],
    NAMES_ZH: ['香港','澳门','台湾','日本','韩国','新加坡','美国','英国','法国','德国','澳大利亚','阿联酋','阿富汗','阿尔巴尼亚','阿尔及利亚','安哥拉','阿根廷','亚美尼亚','奥地利','阿塞拜疆','巴林','孟加拉国','白俄罗斯','比利时','伯利兹','贝宁','不丹','玻利维亚','波斯尼亚和黑塞哥维那','博茨瓦纳','巴西','英属维京群岛','文莱','保加利亚','布基纳法索','布隆迪','柬埔寨','喀麦隆','加拿大','佛得角','开曼群岛','中非共和国','乍得','智利','哥伦比亚','科摩罗','刚果(布)','刚果(金)','哥斯达黎加','克罗地亚','塞浦路斯','捷克','丹麦','吉布提','多米尼加共和国','厄瓜多尔','埃及','萨尔瓦多','赤道几内亚','厄立特里亚','爱沙尼亚','埃塞俄比亚','斐济','芬兰','加蓬','冈比亚','格鲁吉亚','加纳','希腊','格陵兰','危地马拉','几内亚','圭亚那','海地','洪都拉斯','匈牙利','冰岛','印度','印尼','伊朗','伊拉克','爱尔兰','马恩岛','以色列','意大利','科特迪瓦','牙买加','约旦','哈萨克斯坦','肯尼亚','科威特','吉尔吉斯斯坦','老挝','拉脱维亚','黎巴嫩','莱索托','利比里亚','利比亚','立陶宛','卢森堡','马其顿','马达加斯加','马拉维','马来','马尔代夫','马里','马耳他','毛利塔尼亚','毛里求斯','墨西哥','摩尔多瓦','摩纳哥','蒙古','黑山共和国','摩洛哥','莫桑比克','缅甸','纳米比亚','尼泊尔','荷兰','新西兰','尼加拉瓜','尼日尔','尼日利亚','朝鲜','挪威','阿曼','巴基斯坦','巴拿马','巴拉圭','秘鲁','菲律宾','葡萄牙','波多黎各','卡塔尔','罗马尼亚','俄罗斯','卢旺达','圣马力诺','沙特阿拉伯','塞内加尔','塞尔维亚','塞拉利昂','斯洛伐克','斯洛文尼亚','索马里','南非','西班牙','斯里兰卡','苏丹','苏里南','斯威士兰','瑞典','瑞士','叙利亚','塔吉克斯坦','坦桑尼亚','泰国','多哥','汤加','特立尼达和多巴哥','突尼斯','土耳其','土库曼斯坦','美属维尔京群岛','乌干达','乌克兰','乌拉圭','乌兹别克斯坦','委内瑞拉','越南','也门','赞比亚','津巴布韦','安道尔','留尼汪','波兰','关岛','梵蒂冈','列支敦士登','库拉索','塞舌尔','南极','直布罗陀','古巴','法罗群岛','奥兰群岛','百慕达','东帝汶'],
    NAMES_FULL: ['Hong Kong','Macao','Taiwan','Japan','Korea','Singapore','United States','United Kingdom','France','Germany','Australia','Dubai','Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Austria','Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','British Virgin Islands','Brunei','Bulgaria','Burkina-faso','Burundi','Cambodia','Cameroon','Canada','CapeVerde','CaymanIslands','Central African Republic','Chad','Chile','Colombia','Comoros','Congo-Brazzaville','Congo-Kinshasa','CostaRica','Croatia','Cyprus','Czech Republic','Denmark','Djibouti','Dominican Republic','Ecuador','Egypt','EISalvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','Gabon','Gambia','Georgia','Ghana','Greece','Greenland','Guatemala','Guinea','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Ivory Coast','Jamaica','Jordan','Kazakstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar(Burma)','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','NorthKorea','Norway','Oman','Pakistan','Panama','Paraguay','Peru','Philippines','Portugal','PuertoRico','Qatar','Romania','Russia','Rwanda','SanMarino','SaudiArabia','Senegal','Serbia','SierraLeone','Slovakia','Slovenia','Somalia','SouthAfrica','Spain','SriLanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Tajikstan','Tanzania','Thailand','Togo','Tonga','TrinidadandTobago','Tunisia','Turkey','Turkmenistan','U.S.Virgin Islands','Uganda','Ukraine','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Andorra','Reunion','Poland','Guam','Vatican','Liechtensteins','Curacao','Seychelles','Antarctica','Gibraltar','Cuba','Faroe Islands','Ahvenanmaa','Bermuda','Timor-Leste']
};

// 特殊标识配置 - 需要保留的描述标识（完整版）
const SPECIAL_IDENTIFIERS = [
    // ===== 网络协议类 =====
    'IPv6', 'IPv4', 'UDP', 'TCP', 'HTTP2', 'HTTP/2', 'QUIC', 'gRPC', 
    'WebSocket', 'WS', 'TLS1.3', 'TLS', 'SSL', 'H2', 'H3',

    // ===== 线路类型 =====
    // 专线类
    'IEPL', 'IPLC', 'MPLS', 'SD-WAN', 'SASE',
    // CN2线路
    'CN2', 'CN2-GIA', 'CN2-GT', 'GIA', 'GT',
    // AS号段
    'AS9929', 'AS4837', 'AS10099', 'AS21859', 'AS4134', 'AS9808', 'AS17623',
    // 直连优化
    'BGP', 'Anycast', '中转', '直连', '专线', '优化', '负载均衡', 'LB',
    // 城市直连
    '沪港', '深港', '广港', '京港', '杭港', '成港', '渝港',
    '沪日', '深日', '广日', '京日', '杭日',
    '沪美', '深美', '广美', '京美',
    '沪新', '深新', '广新', '京新',

    // ===== 运营商 =====
    // 国内运营商
    '联通', '电信', '移动', '广电', '教育网', '鹏博士',
    'Unicom', 'Telecom', 'Mobile', 'ChinaNet', 'CERNET',
    // 国外运营商
    'NTT', 'KDDI', 'SoftBank', 'IIJ', 'GTT', 'Cogent', 'Level3',
    'Telia', 'Hurricane', 'Zayo', 'Lumen', 'CenturyLink',

    // ===== 云服务商 =====
    'AWS', 'GCP', 'Azure', 'CloudFlare', 'CF', 'Cloudflare',
    'Vultr', 'DigitalOcean', 'DO', 'Linode', 'Hetzner',
    '阿里云', '腾讯云', '华为云', '百度云', 'UCloud',
    'Oracle', 'IBM', 'Heroku', 'Vercel',

    // ===== 流媒体解锁 =====
    // 视频平台
    'Netflix', 'Disney+', 'Disney', 'Hulu', 'HBO Max', 'HBO', 
    'Amazon Prime', 'Prime Video', 'Prime', 'Apple TV+', 'Apple TV',
    'YouTube Premium', 'YouTube', 'Twitch', 'TikTok', 'Instagram', 'Facebook',
    'Paramount+', 'Peacock', 'Discovery+', 'Crunchyroll', 'Funimation',
    '奈飞', '迪士尼', '油管', '脸书', '推特', '抖音',
    // 音乐平台
    'Spotify', 'Apple Music', 'Amazon Music', 'Pandora', 'Deezer',
    // 体育直播
    'ESPN+', 'DAZN', 'MLB.TV', 'NBA League Pass',
    // 地区特色
    'BBC iPlayer', 'ITV Hub', 'Channel 4', 'TVB', 'ViuTV',
    'AbemaTV', 'GYAO', 'Paravi', 'U-NEXT',

    // ===== AI服务 =====
    'ChatGPT', 'GPT', 'OpenAI', 'Claude', 'Bard', 'Bing Chat', 'Copilot',
    'Midjourney', 'Stable Diffusion', 'DALL-E', 'Runway',
    'Perplexity', 'Character.AI', 'Replika',

    // ===== 游戏优化 =====
    'Game', 'Gaming', 'Steam', 'Epic', 'PlayStation', 'Xbox',
    'Battle.net', 'Origin', 'Uplay', 'GOG', 'Riot Games',
    '游戏', '游戏专用', '低延迟', '游戏加速',
    'CSGO', 'Valorant', 'LOL', 'PUBG', 'Fortnite', 'Apex',
    'Genshin', '原神', 'FFXIV', 'WOW', 'Minecraft',

    // ===== 等级标识 =====
    'Premium', 'Pro', 'Plus', 'Ultra', 'Standard', 'Basic', 'VIP',
    'Enterprise', 'Business', 'Personal', 'Free',
    '高级', '标准', '基础', '豪华', '企业', '商务', '个人',
    'Lite', 'Max', 'Super', 'Mega', 'Hyper',

    // ===== 特殊功能 =====
    'CDN', 'Edge', 'Core', 'Kernel', 'Node', 'Relay',
    '核心', '边缘', '节点', '中继',
    '实验', '测试', 'Beta', 'Alpha', 'Stable', 'RC',
    '故障转移', 'Failover', 'Backup', 'Mirror',

    // ===== 地理位置标识 =====
    // 入口城市
    '沪', '深', '广', '京', '杭', '成都', '重庆', '西安', '武汉',
    '上海', '深圳', '广州', '北京', '杭州',
    // 特殊地理标识
    'BGP多线', '双线', '三线', '四线',

    // ===== 协议和工具 =====
    'V2Ray', 'VMess', 'VLESS', 'Trojan', 'Shadowsocks', 'SS', 'SSR',
    'WireGuard', 'OpenVPN', 'IKEv2', 'L2TP', 'PPTP',
    'Hysteria', 'TUIC', 'Naive', 'Brook', 'Xray',

    // ===== 倍率标识 =====
    '0.1x', '0.2x', '0.5x', '0.8x', '1x', '2x', '3x', '5x', '10x', '20x',
    '不限流', '无限流量', 'Unlimited',

    // ===== 端口和加密 =====
    '443端口', '80端口', '8080端口', '8443端口',
    'AES-256', 'ChaCha20', 'AES-128',

    // ===== 特殊服务 =====
    'OpenConnect', 'AnyConnect', 'Clash', 'Surge', 'Quantumult',
    'ChatBot', 'API', 'Webhook', 'RSS',
    
    // ===== 时间和地区限制 =====
    '24H', '7x24', '全天候', 'Always On',
    '工作日', '周末', 'Weekday', 'Weekend',
    
    // ===== 其他常见标识 =====
    'DMIT', 'RackNerd', 'BandwagonHost', 'Hostwinds',
    'NameCheap', 'GoDaddy', 'Cloudways',
    '家宽', '商宽', '教育网', '科研网',
    'Residential', 'Datacenter', 'ISP',
    
    // ===== 新兴服务 =====
    'Web3', 'NFT', 'DeFi', 'Crypto', 'Bitcoin', 'Ethereum',
    'TOR', 'I2P', 'Freenet', 'ZeroNet'
];

// 正则表达式
const REGEX_PATTERNS = {
    nameClear: /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL)/i,
    highMultiplier: /(高倍|(?!1)2+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i,
    anyMultiplier: /(高倍|(?!1)(0\.|\d)+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i,
    rateExtraction: /((倍率|X|x|×)\D?((\d{1,3}\.)?\d+)\D?)|((\d{1,3}\.)?\d+)(倍|X|x|×)/,
    // 动态创建特殊标识匹配正则
    specialIdentifier: new RegExp(SPECIAL_IDENTIFIERS.join('|'), 'gi')
};

// 地区名称替换规则
const REGION_NAME_RULES = {
    GB: /UK/g,
    "Hong Kong": /Hongkong|HONG KONG/gi,
    "United States": /USA|Los Angeles|San Jose|Silicon Valley|Michigan/g,
    澳大利亚: /澳洲|墨尔本|悉尼|土澳|(深|沪|呼|京|广|杭)澳/g,
    德国: /(深|沪|呼|京|广|杭)德(?!.*(I|线))|法兰克福|滬德/g,
    香港: /(深|沪|呼|京|广|杭)港(?!.*(I|线))/g,
    日本: /(深|沪|呼|京|广|杭|中|辽)日(?!.*(I|线))|东京|大坂/g,
    新加坡: /狮城|(深|沪|呼|京|广|杭)新/g,
    美国: /(深|沪|呼|京|广|杭)美|波特兰|芝加哥|哥伦布|纽约|硅谷|俄勒冈|西雅图/g,
    台湾: /新台|新北|台(?!.*线)/g,
    韩国: /春川|韩|首尔/g,
    英国: /伦敦/g
};

// ===== 配置类 (Configuration Class) =====
class RenameConfig {
    constructor(args = {}) {
        this.preserveNoMultiplier = args.nx || false;
        this.preserveMultiplier = args.bl || false;
        this.nameFirst = args.nf || false;
        this.preserveGameGrade = args.blgd || false;
        this.sortByMultiplier = args.blpx || false;
        this.preserveHighMultiplier = args.blnx || false;
        this.removeOneNumber = args.one || false;
        this.clearInvalidNames = args.clear || false;
        this.addFlag = args.flag || false;
        this.preserveUnmatched = args.nm || false;
        this.preserveSpecialIdentifiers = args.special !== false; // 默认开启特殊标识保留

        this.flagSeparator = args.fgf === undefined ? DEFAULT_SEPARATOR : decodeURI(args.fgf);
        this.numberSeparator = args.sn === undefined ? DEFAULT_NUMBER_SEPARATOR : decodeURI(args.sn);
        
        this.namePrefix = args.name === undefined ? "" : decodeURI(args.name);
        this.preserveKeywords = args.blkey === undefined ? "" : decodeURI(args.blkey);
        this.blockQuic = args.blockquic === undefined ? "" : decodeURI(args.blockquic);
        
        const nameMapping = { cn: "cn", zh: "cn", us: "us", en: "us", quan: "quan", gq: "gq", flag: "gq" };
        this.inputNameType = nameMapping[args.in] || "";
        this.outputNameType = nameMapping[args.out] || "";
    }
}

// ===== 国家映射管理类 (Country Mapper Class) =====
class CountryMapper {
    constructor() {
        this.countryMappings = {};
        this.isInitialized = false;
        this.mappingEntries = [];
    }

    getCountryList(type) {
        switch (type) {
            case 'us': return COUNTRY_DATA.CODES_EN;
            case 'gq': return COUNTRY_DATA.FLAGS;
            case 'quan': return COUNTRY_DATA.NAMES_FULL;
            default: return COUNTRY_DATA.NAMES_ZH;
        }
    }

    initialize(inputType, outputType) {
        if (this.isInitialized) return;

        const outputList = this.getCountryList(outputType);
        const inputSources = (inputType !== "") ? [this.getCountryList(inputType)] 
            : [COUNTRY_DATA.NAMES_ZH, COUNTRY_DATA.FLAGS, COUNTRY_DATA.NAMES_FULL, COUNTRY_DATA.CODES_EN];

        inputSources.forEach(inputList => {
            inputList.forEach((value, index) => {
                if (outputList[index]) {
                    this.countryMappings[value] = outputList[index];
                }
            });
        });

        this.mappingEntries = Object.entries(this.countryMappings);
        this.isInitialized = true;
    }

    findMatch(name) {
        const match = this.mappingEntries.find(([key]) => name.includes(key));
        return match ? match[1] : null;
    }
}

// ===== 特殊标识提取器 (Special Identifier Extractor) =====
class SpecialIdentifierExtractor {
    /**
     * 从节点名称中提取特殊标识
     * @param {string} name - 节点名称
     * @returns {string[]} 提取到的特殊标
