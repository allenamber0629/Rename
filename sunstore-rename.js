/**
 * Sub-Store 代理节点重命名脚本
 * @version 2.1.0 (Refactored with Special Identifiers Support)
 * @description 一个经过重构的、用于Sub-Store的代理节点重命名脚本，提供了更清晰的结构和更强的可维护性，支持特殊标识保留。
 * @author Gemini
 * @last-updated 2025-08-09
 *
 * 主要功能：
 * - 支持多种节点名称格式转换（中文、英文、国旗、全称）。
 * - 自动添加序号和前缀。
 * - 过滤和保留特定关键词。
 * - 支持倍率标识处理和排序。
 * - 支持特殊标识保留（如协议类型、线路类型、解锁情况等）。
 */

// ===== 常量定义 (CONSTANTS) =====
const DEFAULT_SEPARATOR = " ";
const DEFAULT_NUMBER_SEPARATOR = " ";
const SEQUENCE_NUMBER_PAD_LENGTH = 2;

// 特殊标识列表（供参考，用户可自定义）
const SPECIAL_IDENTIFIERS = [
    // 协议类型
    'V2Ray', 'VMess', 'VLess', 'Trojan', 'Shadowsocks', 'SSR', 'SS', 'WireGuard', 'Tuic', 'Hysteria', 'Socks5',
    // 线路类型
    'IEPL', 'IPLC', 'CN2', 'CN2 GIA', 'BGP', '专线', '直连', '中转', 'Anycast', 'MPLS', 'SD-WAN',
    // 网络质量/延迟
    '低延迟', '高速', '优质', '稳定', '不稳定', '高丢包', '低丢包',
    // 用途/优化
    '游戏', 'Gaming', '加速', '下载', 'Download', '流媒体', 'Streaming', '办公', 'Office', '学术', 'Research',
    // 解锁情况
    'Netflix', 'NF', 'Disney+', 'Disney', 'HBO', 'Hulu', 'Amazon', 'Prime', 'YouTube', 'Spotify', 'Apple TV', 'BBC', 'iPlayer', 'TikTok', 'ChatGPT', 'AI', '解锁', 'Unlock',
    // 会员等级/套餐
    'VIP', 'Pro', 'Premium', 'Plus', 'Standard', 'Basic', 'Lite', 'Enterprise', 'Team', 'Business',
    // 其他特性
    'IPv6', 'IPv4', '双栈', '原生IP', '住宅IP', '数据中心', '无审计', 'No-Log', 'P2P', '端口转发', 'Port Forwarding',
    // 运营商/合作
    '阿里云', '腾讯云', 'AWS', 'Azure', 'Google Cloud', 'GCP', 'Oracle', 'Cloudflare', 'CDN', 'Akamai',
    // 特殊标记
    '测试', 'Test', '体验', 'Trial', '备用', 'Backup', '临时', 'Temp', '紧急', 'Emergency'
];

// 国家/地区数据
const COUNTRY_DATA = {
    FLAGS: ['🇭🇰','🇲🇴','🇹🇼','🇯🇵','🇰🇷','🇸🇬','🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇦🇺','🇦🇪','🇦🇫','🇦🇱','🇩🇿','🇦🇴','🇦🇷','🇦🇲','🇦🇹','🇦🇿','🇧🇭','🇧🇩','🇧🇾','🇧🇪','🇧🇿','🇧🇯','🇧🇹','🇧🇴','🇧🇦','🇧🇼','🇧🇷','🇻🇬','🇧🇳','🇧🇬','🇧🇫','🇧🇮','🇰🇭','🇨🇲','🇨🇦','🇨🇻','🇰🇾','🇨🇫','🇹🇩','🇨🇱','🇨🇴','🇰🇲','🇨🇬','🇨🇩','🇨🇷','🇭🇷','🇨🇾','🇨🇿','🇩🇰','🇩🇯','🇩🇴','🇪🇨','🇪🇬','🇸🇻','🇬🇶','🇪🇷','🇪🇪','🇪🇹','🇫🇯','🇫🇮','🇬🇦','🇬🇲','🇬🇪','🇬🇭','🇬🇷','🇬🇱','🇬🇹','🇬🇳','🇬🇾','🇭🇹','🇭🇳','🇭🇺','🇮🇸','🇮🇳','🇮🇩','🇮🇷','🇮🇶','🇮🇪','🇮🇲','🇮🇱','🇮🇹','🇨🇮','🇯🇲','🇯🇴','🇰🇿','🇰🇪','🇰🇼','🇰🇬','🇱🇦','🇱🇻','🇱🇧','🇱🇸','🇱🇷','🇱🇾','🇱🇹','🇱🇨','🇱🇮','🇱🇰','🇱🇷','🇱🇸','🇱🇹','🇱🇺','🇱🇻','🇱🇾','🇲🇦','🇲🇨','🇲🇩','🇲🇪','🇲🇬','🇲🇭','🇲🇰','🇲🇱','🇲🇲','🇲🇳','🇲🇴','🇲🇵','🇲🇶','🇲🇷','🇲🇸','🇲🇹','🇲🇺','🇲🇻','🇲🇼','🇲🇽','🇲🇾','🇲🇿','🇳🇦','🇳🇨','🇳🇪','🇳🇫','🇳🇬','🇳🇮','🇳🇱','🇳🇴','🇳🇵','🇳🇷','🇳🇺','🇳🇿','🇴🇲','🇵🇦','🇵🇪','🇵🇫','🇵🇬','🇵🇭','🇵🇰','🇵🇱','🇵🇲','🇵🇳','🇵🇷','🇵🇸','🇵🇹','🇵🇼','🇵🇾','🇶🇦','🇷🇪','🇷🇴','🇷🇸','🇷🇺','🇷🇼','🇸🇦','🇸🇧','🇸🇨','🇸🇩','🇸🇪','🇸🇬','🇸🇭','🇸🇮','🇸🇯','🇸🇰','🇸🇱','🇸🇲','🇸🇳','🇸🇴','🇸🇷','🇸🇸','🇸🇹','🇸🇻','🇸🇾','🇸🇿','🇹🇨','🇹🇩','🇹🇫','🇹🇬','🇹🇭','🇹🇯','🇹🇰','🇹🇱','🇹🇲','🇹🇳','🇹🇴','🇹🇷','🇹🇹','🇹🇻','🇹🇼','🇹🇿','🇺🇦','🇺🇬','🇺🇲','🇺🇳','🇺🇸','🇺🇾','🇺🇿','🇻🇦','🇻🇨','🇻🇪','🇻🇬','🇻🇮','🇻🇳','🇻🇺','🇼🇫','🇼🇸','🇽🇰','🇾🇪','🇾🇹','🇿🇦','🇿🇲','🇿🇼'],
    CODES_EN: ['HK','MO','TW','JP','KR','SG','US','GB','FR','DE','AU','AE','AF','AL','DZ','AO','AR','AM','AT','AZ','BH','BD','BY','BE','BZ','BJ','BT','BO','BA','BW','BR','VG','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CO','KM','CG','CD','CR','HR','CY','CZ','DK','DJ','DO','EC','EG','SV','GQ','ER','EE','ET','FJ','FI','GA','GM','GE','GH','GR','GL','GT','GN','GY','HT','HN','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','CI','JM','JO','KZ','KE','KW','KG','LA','LV','LB','LS','LR','LY','LT','LU','MK','MG','MW','MY','MV','ML','MT','MR','MU','MX','MD','MC','MN','ME','MA','MZ','MM','NA','NP','NL','NZ','NI','NE','NG','KP','NO','OM','PK','PA','PY','PE','PH','PT','PR','QA','RO','RU','RW','SM','SA','SN','RS','SL','SK','SI','SO','ZA','ES','LK','SD','SR','SZ','SE','CH','SY','TJ','TZ','TH','TG','TO','TT','TN','TR','TM','VI','UG','UA','UY','UZ','VE','VN','YE','ZM','ZW','AD','RE','PL','GU','VA','LI','CW','SC','AQ','GI','CU','FO','AX','BM','TL'],
    NAMES_ZH: ['香港','澳门','台湾','日本','韩国','新加坡','美国','英国','法国','德国','澳大利亚','阿联酋','阿富汗','阿尔巴尼亚','阿尔及利亚','安哥拉','阿根廷','亚美尼亚','奥地利','阿塞拜疆','巴林','孟加拉国','白俄罗斯','比利时','伯利兹','贝宁','不丹','玻利维亚','波斯尼亚和黑塞哥维那','博茨瓦纳','巴西','英属维京群岛','文莱','保加利亚','布基纳法索','布隆迪','柬埔寨','喀麦隆','加拿大','佛得角','开曼群岛','中非共和国','乍得','智利','哥伦比亚','科摩罗','刚果(布)','刚果(金)','哥斯达黎加','克罗地亚','塞浦路斯','捷克','丹麦','吉布提','多米尼加共和国','厄瓜多尔','埃及','萨尔瓦多','赤道几内亚','厄立特里亚','爱沙尼亚','埃塞俄比亚','斐济','芬兰','加蓬','冈比亚','格鲁ジア','加纳','希腊','格陵兰','危地马拉','几内亚','圭亚那','海地','洪都拉斯','匈牙利','冰岛','印度','印尼','伊朗','伊拉克','爱尔兰','马恩岛','以色列','意大利','科特迪瓦','牙买加','约旦','哈萨克斯坦','肯尼亚','科威特','吉尔吉斯斯坦','老挝','拉脱维亚','黎巴嫩','莱索托','利比里亚','利比亚','立陶宛','卢森堡','马其顿','马达加斯加','马拉维','马来','马尔代夫','马里','马耳他','毛利塔尼亚','毛里求斯','墨西哥','摩尔多瓦','摩纳哥','蒙古','黑山共和国','摩洛哥','莫桑比克','缅甸','纳米比亚','尼泊尔','荷兰','新西兰','尼加拉瓜','尼日尔','尼日利亚','朝鲜','挪威','阿曼','巴基斯坦','巴拿马','巴拉圭','秘鲁','菲律宾','葡萄牙','波多黎各','卡塔尔','罗马尼亚','俄罗斯','卢旺达','圣马力诺','沙特阿拉伯','塞内加尔','塞尔维亚','塞拉利昂','斯洛伐克','斯洛文尼亚','索马里','南非','西班牙','斯里兰卡','苏丹','苏里南','斯威士兰','瑞典','瑞士','叙利亚','塔吉克斯坦','坦桑尼亚','泰国','多哥','汤加','特立尼达和多巴哥','突尼斯','土耳其','土库曼斯坦','美属维尔京群岛','乌干达','乌克兰','乌拉圭','乌兹别克斯坦','委内瑞拉','越南','也门','赞比亚','津巴布韦','安道尔','留尼汪','波兰','关岛','梵蒂冈','列支敦士登','库拉索','塞舌尔','南极','直布罗陀','古巴','法罗群岛','奥兰群岛','百慕达','东帝汶'],
    NAMES_FULL: ['Hong Kong','Macao','Taiwan','Japan','Korea','Singapore','United States','United Kingdom','France','Germany','Australia','Dubai','Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Austria','Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','British Virgin Islands','Brunei','Bulgaria','Burkina-faso','Burundi','Cambodia','Cameroon','Canada','CapeVerde','CaymanIslands','Central African Republic','Chad','Chile','Colombia','Comoros','Congo-Brazzaville','Congo-Kinshasa','CostaRica','Croatia','Cyprus','Czech Republic','Denmark','Djibouti','Dominican Republic','Ecuador','Egypt','EISalvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','Gabon','Gambia','Georgia','Ghana','Greece','Greenland','Guatemala','Guinea','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Ivory Coast','Jamaica','Jordan','Kazakstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar(Burma)','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','NorthKorea','Norway','Oman','Pakistan','Panama','Paraguay','Peru','Philippines','Portugal','PuertoRico','Qatar','Romania','Russia','Rwanda','SanMarino','SaudiArabia','Senegal','Serbia','SierraLeone','Slovakia','Slovenia','Somalia','SouthAfrica','Spain','SriLanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Tajikstan','Tanzania','Thailand','Togo','Tonga','TrinidadandTobago','Tunisia','Turkey','Turkmenistan','U.S.Virgin Islands','Uganda','Ukraine','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Andorra','Reunion','Poland','Guam','Vatican','Liechtensteins','Curacao','Seychelles','Antarctica','Gibraltar','Cuba','Faroe Islands','Ahvenanmaa','Bermuda','Timor-Leste']
};

// 正则表达式
const REGEX_PATTERNS = {
    nameClear: /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL)/i,
    highMultiplier: /(高倍|(?!1)2+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i,
    anyMultiplier: /(高倍|(?!1)(0\.|\d)+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i,
    rateExtraction: /((倍率|X|x|×)\D?((\d{1,3}\.)?\d+)\D?)|((\d{1,3}\.)?\d+)(倍|X|x|×)/
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
    英国: /伦敦/g,
    // ...可以继续添加更多规则
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

        this.flagSeparator = args.fgf === undefined ? DEFAULT_SEPARATOR : decodeURI(args.fgf);
        this.numberSeparator = args.sn === undefined ? DEFAULT_NUMBER_SEPARATOR : decodeURI(args.sn);
        
        this.namePrefix = args.name === undefined ? "" : decodeURI(args.name);
        this.preserveKeywords = args.blkey === undefined ? "" : decodeURI(args.blkey);
        this.blockQuic = args.blockquic === undefined ? "" : decodeURI(args.blockquic);
        
        // 新增：特殊标识保留配置
        this.preserveSpecialIdentifiers = args.preserveSpecial || false; // 是否保留特殊标识
        this.specialIdentifiers = args.specialIdentifiers ? decodeURI(args.specialIdentifiers).split(',') : []; // 用户自定义特殊标识列表
        
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

// ===== 代理节点重命名器 (Proxy Renamer Class) =====
class ProxyRenamer {
    constructor(config) {
        this.config = config;
        this.countryMapper = new CountryMapper();
    }

    rename(proxyList) {
        this.countryMapper.initialize(this.config.inputNameType, this.config.outputNameType);

        let filteredProxies = this.filterProxies(proxyList);
        let processedProxies = this.processProxyNames(filteredProxies)
                                   .filter(p => p.name !== null); // 移除处理后名称为空的节点
        
        this.addSequenceNumbers(processedProxies);
        
        if (this.config.removeOneNumber) {
            this.removeSingleNodeNumbers(processedProxies);
        }
        
        if (this.config.sortByMultiplier) {
            processedProxies.sort((a, b) => this.extractMultiplier(a.name) - this.extractMultiplier(b.name));
        }

        return processedProxies;
    }

    filterProxies(proxyList) {
        return proxyList.filter(proxy => {
            const name = proxy.name;
            if (this.config.clearInvalidNames && REGEX_PATTERNS.nameClear.test(name)) return false;
            if (this.config.preserveNoMultiplier && REGEX_PATTERNS.anyMultiplier.test(name)) return false;
            if (this.config.preserveHighMultiplier && !REGEX_PATTERNS.highMultiplier.test(name)) return false;
            return true;
        });
    }

    processProxyNames(proxyList) {
        return proxyList.map(proxy => {
            let name = proxy.name;
            let retainedKeywords = "";
            let specialIdentifierTags = ""; // 新增：用于存储特殊标识

            // 预处理地区名称
            Object.entries(REGION_NAME_RULES).forEach(([replacement, regex]) => {
                name = name.replace(regex, replacement);
            });

            // 保留关键词
            if (this.config.preserveKeywords) {
                const keywords = this.config.preserveKeywords.split(',');
                const foundKeywords = keywords.filter(kw => name.includes(kw));
                if (foundKeywords.length > 0) {
                    retainedKeywords = foundKeywords.join(' ');
                }
            }

            // 提取倍率
            if (this.config.preserveMultiplier) {
                const rateMatch = name.match(REGEX_PATTERNS.rateExtraction);
                if (rateMatch) {
                    retainedKeywords += ` ${rateMatch[0]}`;
                }
            }
            
            // 新增：提取特殊标识
            if (this.config.preserveSpecialIdentifiers) {
                // 如果用户提供了自定义特殊标识列表，则使用用户的列表；否则使用默认列表
                const identifiersToCheck = this.config.specialIdentifiers.length > 0 ? this.config.specialIdentifiers : SPECIAL_IDENTIFIERS;
                const foundIdentifiers = identifiersToCheck.filter(identifier => name.includes(identifier));
                if (foundIdentifiers.length > 0) {
                    specialIdentifierTags = foundIdentifiers.join(' ');
                }
            }
            
            // 查找国家/地区并替换
            const countryMatch = this.countryMapper.findMatch(name);
            if (countryMatch) {
                const flag = this.config.addFlag ? `${COUNTRY_DATA.FLAGS[COUNTRY_DATA.NAMES_ZH.indexOf(countryMatch)]}${this.config.flagSeparator}` : "";
                // 新增：将特殊标识加入名称部分
                const nameParts = [this.config.namePrefix, flag, countryMatch, specialIdentifierTags, retainedKeywords.trim()].filter(Boolean);
                proxy.name = nameParts.join(DEFAULT_SEPARATOR);
            } else if (this.config.preserveUnmatched) {
                proxy.name = [this.config.namePrefix, name].filter(Boolean).join(DEFAULT_SEPARATOR);
            } else {
                proxy.name = null; // 标记为待移除
            }
            
            // 处理 QUIC 禁用
            if (proxy.name && this.config.blockQuic) {
                const quicKeywords = this.config.blockQuic.split(',');
                if (quicKeywords.some(kw => proxy.name.includes(kw))) {
                    proxy.quic = { enabled: false };
                }
            }

            return proxy;
        });
    }

    addSequenceNumbers(proxyList) {
        const nameGroups = {};
        proxyList.forEach(p => {
            if (!nameGroups[p.name]) nameGroups[p.name] = [];
            nameGroups[p.name].push(p);
        });

        Object.values(nameGroups).forEach(group => {
            if (group.length > 1) {
                group.forEach((p, i) => {
                    const seq = String(i + 1).padStart(SEQUENCE_NUMBER_PAD_LENGTH, '0');
                    p.name = `${p.name}${this.config.numberSeparator}${seq}`;
                });
            }
        });
    }

    removeSingleNodeNumbers(proxyList) {
        const nameGroups = {};
        proxyList.forEach(p => {
            const baseName = p.name.replace(/(\s\d+)$/, '').trim();
            if (!nameGroups[baseName]) nameGroups[baseName] = [];
            nameGroups[baseName].push(p);
        });

        Object.values(nameGroups).forEach(group => {
            if (group.length === 1) {
                group[0].name = group[0].name.replace(/(\s\d+)$/, '').trim();
            }
        });
    }

    extractMultiplier(name) {
        const match = name.match(REGEX_PATTERNS.rateExtraction);
        if (match) {
            const rateStr = match[3] || match[5];
            return parseFloat(rateStr) || 999;
        }
        return 1; // 默认倍率为1
    }
}

// ===== 主函数入口 (Main Entry Point) =====
function operator(proxyList, options) {
    const config = new RenameConfig(options);
    const renamer = new ProxyRenamer(config);
    return renamer.rename(proxyList);
}
