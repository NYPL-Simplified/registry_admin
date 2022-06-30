/* eslint-disable camelcase */

export interface LibrariesData {
  uuid: string;
  basic_info: {
    name: string;
    description: string;
    short_name: string;
    number_of_patrons: string;
  };
  urls_and_contact: {
    authentication_url: string;
    contact_email: string;
    copyright_email: string;
    help_email: string;
    opds_url: string;
    web_url: string;
  };
  areas: {
    focus: string[];
  };
  stages: {
    library_stage: 'testing' | 'production' | 'canceled';
    registry_stage: 'testing' | 'production' | 'canceled';
  };
}

const libraries: LibrariesData[] = [
  {
    uuid: '1',
    basic_info: {
      name: 'Acton Public Library',
      description: 'Serving Old Saybrook, CT',
      short_name: 'CTACTN',
      number_of_patrons: '9',
    },
    urls_and_contact: {
      authentication_url:
        'https://lion.lyrasistechnology.org/acton/authentication_document',
      contact_email: 'actonlibrary@actonlibrary.org',
      copyright_email: 'actonlibrary@actonlibrary.org',
      help_email: 'actonlibrary@actonlibrary.org',
      opds_url: 'https://lion.lyrasistechnology.org/acton/',
      web_url: 'http://www.actonlibrary.org/',
    },
    areas: {
      focus: ['06475'],
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
  },
  {
    uuid: '2',
    basic_info: {
      name: 'Ak-Chin Indian Community Library, AZ',
      description: 'Serving the needs of library users in Arizona',
      short_name: 'LVYZVC',
      number_of_patrons: '5',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye.amigos.org/azakchinindiancommunity/authentication_document',
      contact_email: 'simplye@amigos.org',
      copyright_email: 'library@ak-chin.nsn.us',
      help_email: 'library@ak-chin.nsn.us',
      opds_url: 'https://simplye.amigos.org/azakchinindiancommunity/',
      web_url:
        'https://ak-chin.nsn.us/index.php/departments/membership-services',
    },
    areas: {
      focus: ['Maricopa, AZ'],
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
  },
  {
    uuid: '3',
    basic_info: {
      name: 'Alameda County Library',
      description: 'Infinite possibilities',
      short_name: 'CALMDA',
      number_of_patrons: '1839',
    },
    urls_and_contact: {
      authentication_url:
        'http://acl.simplye-ca.org/CALMDA/authentication_document',
      contact_email: 'pmackinnon@califa.org',
      copyright_email: 'simplye@aclibrary.org',
      help_email: 'simplye@aclibrary.org',
      opds_url: 'http://acl.simplye-ca.org/CALMDA/',
      web_url: 'http://aclibrary.org/',
    },
    areas: {
      focus: [],
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
  },
  {
    uuid: '4',
    basic_info: {
      name: 'Alicia Salinas City of Alice Public Library, TX',
      description:
        'Serving the needs of library users in Jim Wells County, Texas',
      short_name: 'JEVRCG',
      number_of_patrons: '2',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye-tsl1.amigos.org/txaliciasalinascityofalicepublic/authentication_document',
      contact_email: 'simplye@amigos.org',
      copyright_email: 'library@cityofalice.org',
      help_email: 'library@cityofalice.org',
      opds_url:
        'https://simplye-tsl1.amigos.org/txaliciasalinascityofalicepublic/',
      web_url: 'http://www.cityofalice.org/179/Library',
    },
    areas: {
      focus: ['Jim Wells County, TX', 'Alice, TX'],
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
  },
  {
    uuid: '5',
    basic_info: {
      name: 'Allan Shivers Library & Museum, TX',
      description: 'Serving Woodville, TX',
      short_name: 'JEVRCG',
      number_of_patrons: '0',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye-tsl1.amigos.org/txallanshiverslibrarymuseum/authentication_document',
      contact_email: 'simplye@amigos.org',
      copyright_email: 'ashivers.library@yahoo.com',
      help_email: 'ashivers.library@yahoo.com',
      opds_url: 'https://simplye-tsl1.amigos.org/txallanshiverslibrarymuseum/',
      web_url: 'https://www.allanshiverslibrary.com/',
    },
    areas: {
      focus: ['Jim Wells County, TX', 'Alice, TX'],
    },
    stages: {
      library_stage: 'testing',
      registry_stage: 'testing',
    },
  },
  {
    uuid: '6',
    basic_info: {
      name: 'Allegany County Library System',
      description: 'Serving patrons of Maryland',
      short_name: 'JGSVTQ',
      number_of_patrons: '0',
    },
    urls_and_contact: {
      authentication_url:
        'https://allegany.simplye-md.org/MDALLEGANY/authentication_document',
      contact_email: 'alleganycountylibrary@alleganycountylibrary.info',
      copyright_email: 'alleganycountylibrary@alleganycountylibrary.info',
      help_email: 'alleganycountylibrary@alleganycountylibrary.info',
      opds_url: 'https://allegany.simplye-md.org/MDALLEGANY/',
      web_url: 'http://www.alleganycountylibrary.info/',
    },
    areas: {
      focus: ['Everywhere'],
    },
    stages: {
      library_stage: 'testing',
      registry_stage: 'canceled',
    },
  },
  {
    uuid: '7',
    basic_info: {
      name: 'Allen Memorial Public Library, TX',
      description: 'Open a book, open a mind. Knowledge is power.',
      short_name: 'UOVOCB',
      number_of_patrons: '9',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye-tsl1.amigos.org/txallenmemorial/authentication_document',
      contact_email: 'simplye@amigos.org',
      copyright_email: 'hawkins.library@yahoo.com',
      help_email: 'hawkins.library@yahoo.com',
      opds_url: 'https://simplye-tsl1.amigos.org/txallenmemorial/',
      web_url: 'https://www.hawkinslibrary.org/',
    },
    areas: {
      focus: ['Hawkins, TX'],
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
  },
  {
    uuid: '8',
    basic_info: {
      name: 'Alpine Public Library, TX',
      description:
        'Building community, encouraging literacy, and promoting lifelong learning',
      short_name: 'NQSJGC',
      number_of_patrons: '59',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye-tsl1.amigos.org/txalpine/authentication_document',
      contact_email: 'williams@amigos.org',
      copyright_email: 'don@alpinepubliclibrary.org',
      help_email: 'don@alpinepubliclibrary.org',
      opds_url: 'https://simplye-tsl1.amigos.org/txalpine/',
      web_url: 'https://alpinepubliclibrary.org/',
    },
    areas: {
      focus: ['Alpine, TX'],
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
  },
  {
    uuid: '9',
    basic_info: {
      name: 'Amarillo Public Library, TX',
      description: 'Serving the patrons of Amarillo, TX',
      short_name: 'DTENGN',
      number_of_patrons: '78',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye-tsl1.amigos.org/txamarillopubliclibrary/authentication_document',
      contact_email: 'simplye@amigos.org',
      copyright_email: 'reference@amarillolibrary.org',
      help_email: 'reference@amarillolibrary.org',
      opds_url: 'https://simplye-tsl1.amigos.org/txamarillopubliclibrary/',
      web_url: 'https://www.amarillolibrary.org/',
    },
    areas: {
      focus: ['Amarillo, TX'],
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
  },
  {
    uuid: '10',
    basic_info: {
      name: 'Amigos Demo Library',
      description: 'Unite Libraries for Action and Strength',
      short_name: 'WBDOBX',
      number_of_patrons: '22',
    },
    urls_and_contact: {
      authentication_url:
        'https://circ05.simplye.amigos.org/txamigosls/authentication_document',
      contact_email: 'simplye@amigos.org',
      copyright_email: 'simplye@amigos.org',
      help_email: 'simplye@amigos.org',
      opds_url: 'https://circ05.simplye.amigos.org/txamigosls/',
      web_url: 'https://www.amigos.org',
    },
    areas: {
      focus: ['Dallas, TX'],
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
  },
  {
    uuid: '11',
    basic_info: {
      name: 'Amigos Test Library Two',
      description: 'Unite Libraries for Action and Strength',
      short_name: 'ZKVRQT',
      number_of_patrons: '0',
    },
    urls_and_contact: {
      authentication_url:
        'https://circ06.dev.simplye.amigos.org/txamgtesttwo/authentication_document',
      contact_email: 'williams@amigos.org',
      copyright_email: 'williams@amigos.org',
      help_email: 'simplye@amigos.org',
      opds_url: 'https://circ06.dev.simplye.amigos.org/txamgtesttwo/',
      web_url: 'https://www.amigos.org/simplye',
    },
    areas: {
      focus: ['Dallas, TX'],
    },
    stages: {
      library_stage: 'testing',
      registry_stage: 'testing',
    },
  },
  {
    uuid: '12',
    basic_info: {
      name: 'Anacortes Public Library',
      description: 'Serving Anacortes, WA',
      short_name: 'DCJROE',
      number_of_patrons: '0',
    },
    urls_and_contact: {
      authentication_url:
        'https://wa-shared.lyrasistechnology.org/WA0032/authentication_document',
      contact_email: 'library@cityofanacortes.org',
      copyright_email: 'library@cityofanacortes.org',
      help_email: 'library@cityofanacortes.org',
      opds_url: 'https://wa-shared.lyrasistechnology.org/WA0032/',
      web_url: 'https://www.anacorteswa.gov/220/Library',
    },
    areas: {
      focus: [],
    },
    stages: {
      library_stage: 'testing',
      registry_stage: 'canceled',
    },
  },
  {
    uuid: '13',
    basic_info: {
      name: 'Andrews County Library, TX',
      description: 'Explore the world of books.',
      short_name: 'IDKEWG',
      number_of_patrons: '1',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye-tsl1.amigos.org/txandrews/authentication_document',
      contact_email: 'simplye@amigos.org',
      copyright_email: 'dbonham@andrews.lib.tx.us',
      help_email: 'dbonham@andrews.lib.tx.us',
      opds_url: 'https://simplye-tsl1.amigos.org/txandrews/',
      web_url: 'https://www.andrews.lib.tx.us/',
    },
    areas: {
      focus: ['Andrews, TX'],
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
  },
  {
    uuid: '14',
    basic_info: {
      name: 'Anne Arundel Co. Public Library',
      description: 'Educate. Enrich. Inspire.',
      short_name: 'MDANNE',
      number_of_patrons: '0',
    },
    urls_and_contact: {
      authentication_url:
        'https://anne-arundel.simplye-md.org/ANNEARUNDEL/authentication_document',
      contact_email: 'askus@aacpl.libanswers.com',
      copyright_email: 'askus@aacpl.libanswers.com',
      help_email: 'askus@aacpl.libanswers.com',
      opds_url: 'https://anne-arundel.simplye-md.org/ANNEARUNDEL/',
      web_url: 'web_urlhttp://www.aacpl.net',
    },
    areas: {
      focus: ['Everywhere'],
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'canceled',
    },
  },
  {
    uuid: '15',
    basic_info: {
      name: 'Ansonia Public Library',
      description: 'Serving Ansonia, CT',
      short_name: 'CTANSO',
      number_of_patrons: '0',
    },
    urls_and_contact: {
      authentication_url:
        'https://bibliomation.lyrasistechnology.org/ansonia/authentication_document',
      contact_email: 'jonathan.green@lyrasis.org',
      copyright_email: 'jonathan.green@lyrasis.org',
      help_email: 'jonathan.green@lyrasis.org',
      opds_url: 'https://bibliomation.lyrasistechnology.org/ansonia/',
      web_url: 'http://www.ansonialibrary.org/',
    },
    areas: {
      focus: ['Everywhere'],
    },
    stages: {
      library_stage: 'canceled',
      registry_stage: 'canceled',
    },
  },
];

export default libraries;
