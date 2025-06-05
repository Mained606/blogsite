/* Version 2.0 - Fixed YouTube iframe issues */
// AOS 초기화
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-in-out'
});

// 타이핑 애니메이션 클래스
class TypeWriter {
    constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = texts.split('|');
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed = this.deleteSpeed;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    // 다크모드 설정
    const themeToggle = document.querySelector('.theme-toggle');
    const moonIcon = themeToggle.querySelector('i');
    
    // 저장된 테마 불러오기
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme === 'dark');
    } else {
        // 기본값을 라이트모드로 설정
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon(false);
    }
    
    // 테마 토글 이벤트
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme === 'dark');
    });
    
    // 아이콘 업데이트 함수
    function updateThemeIcon(isDark) {
        moonIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // 최상단 이동 버튼 생성 및 추가
    const scrollTopButton = document.createElement('button');
    scrollTopButton.className = 'scroll-top-button';
    scrollTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopButton);

    // 스크롤 위치에 따라 버튼 표시/숨김
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopButton.classList.add('show');
        } else {
            scrollTopButton.classList.remove('show');
        }
    });

    // 최상단 이동 버튼 클릭 이벤트
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 스크롤 시 네비게이션 바 스타일 변경
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    let isMouseNearTop = false;

    // 마우스 움직임 감지
    document.addEventListener('mousemove', function(e) {
        isMouseNearTop = e.clientY <= 60;
        if (isMouseNearTop) {
            navbar.style.transform = 'translateY(0)';
        } else if (window.pageYOffset > 50) {
            navbar.style.transform = 'translateY(-100%)';
        }
    });

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
            
            if (!isMouseNearTop) {
                if (scrollTop > lastScrollTop) {
                    // 아래로 스크롤
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    // 위로 스크롤
                    navbar.style.transform = 'translateY(0)';
                }
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 스무스 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // 모바일 메뉴 닫기
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });

    // 이미지 로딩 처리
    function handleImageError(img) {
        const placeholder = document.createElement('div');
        placeholder.className = 'img-placeholder';
        const icon = document.createElement('i');
        icon.className = 'fas fa-image fa-3x';
        placeholder.appendChild(icon);
        img.parentNode.replaceChild(placeholder, img);
    }

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });

    // 포트폴리오 아이템 호버 효과
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.portfolio-overlay').style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.portfolio-overlay').style.opacity = '0';
        });
    });

    // 포트폴리오 필터링
    const portfolioFilters = document.querySelectorAll('.portfolio-filter button');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.getAttribute('data-filter');
            
            portfolioFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            portfolioItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 연락처 폼 제출
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 여기에 폼 제출 로직 추가
            alert('메시지가 전송되었습니다.');
            this.reset();
        });
    }

    // 프로젝트 데이터
    const projectData = {
        spaceship: {
            title: "SpaceShipLooting VR",
            type: "VR 잠입 액션 게임",
            period: "2023.11.25 ~ 2023.12.31 (5주)",
            teamSize: "5명 (부 팀장 및 개발 팀장)",
            environment: {
                development: "Unity 6 (URP), C#, Meta Quest",
                build: "PC, Android APK"
            },
            youtube: "NVzRJA02070",
            links: [
                { url: "https://github.com/Mained606/SpaceShipLooting_VR", icon: "github", text: "GitHub" },
                { url: "https://drive.google.com/file/d/1-kLGxgn0eo2nxvytOxzWS7SnPG50cNxC/view?usp=drive_link", icon: "google-drive", text: "빌드 다운로드" }
            ],
            tech: ["XR Interaction Toolkit", "Oculus Integration", "상태 패턴", "커스텀 셰이더"],
            overview: "우주선을 배경으로 한 VR 잠입 액션 게임입니다. 플레이어는 우주선 내부를 탐험하며 총과 레이저 검을 활용해 퍼즐을 풀어 우주선을 탈취하고 보스를 처치하는 미션을 수행합니다. 팀장으로서 전체 시스템 설계 및 핵심 기능 구현을 주도하였고, 특히 VR 환경에 적합한 상호작용과 최적화된 사용자 경험 제공에 집중하였습니다.",
            responsibilities: [
                {
                    title: "VR 프로젝트 환경 구축",
                    points: [
                        "Meta Quest 기반 VR 개발 환경 설정",
                        "XR Interaction Toolkit 기반 상호작용 기능 구현",
                        "URP 설정을 통한 렌더링 최적화",
                        "안정적인 빌드를 위한 프로젝트 구조 설계"
                    ]
                },
                {
                    title: "플레이어 시스템 구현",
                    points: [
                        "VR 컨트롤러 입력 처리 및 장비 동기화 시스템 개발",
                        "체력, 데미지, 위치 추적 기능 구현",
                        "플레이어 장비(조끼, 나이트비전 등)의 정확한 위치 유지 기능 개발",
                        "조끼에 XR 소켓 오브젝트 기능으로 장비 장착 시스템 기능 개발",
                        "하트 사운드 시스템 구현 (거리별 심박 사운드 조절)"
                    ]
                },
                {
                    title: "보스 AI 시스템 개발",
                    points: [
                        "FSM을 활용한 보스 AI 구조 설계",
                        "공격 패턴, 상태 변화, 피격 로직 구현",
                        "체력 관리 및 전투 흐름 제어",
                        "보스 이펙트 VFX 구현 및 적용"
                    ]
                },
                {
                    title: "인터랙션 및 게임 시스템 구현",
                    points: [
                        "VR 컨트롤러 기반 상호작용 기능 구현",
                        "커스텀 아웃라인 셰이더 개발로 상호작용 시각 피드백 제공",
                        "아이템 획득 및 사용 시스템 구현",
                        "커스텀 셰이더 기반의 레드 도트 사이트 구현"
                    ]
                }
            ],
            challenges: [
                {
                    title: "VR 원점 동기화 문제",
                    problem: "VR 기기에서 원점 재설정 시 인게임 진입 후 플레이어 장비 위치 오류 발생",
                    solution: "BodyObjectPositionSetting 클래스를 통해 VR 카메라 위치 실시간 추적 및 상대 위치 계산 적용",
                    result: "기기 위치 변경에도 장비 위치가 정확히 유지됨"
                },
                {
                    title: "씬 전환 시 상태 초기화 문제",
                    problem: "씬 전환 시 플레이어 상태(총알 수 등)가 초기화됨",
                    solution: "중앙 GameManager 및 SaveLoad 시스템을 통한 상태 저장/복원 구조 설계",
                    result: "씬 전환 후에도 플레이어 상태가 유지되어 안정적인 게임 진행 가능"
                },
                {
                    title: "VFX 빌드 호환 문제",
                    problem: "보스 이펙트가 APK 빌드 환경에서 정상 출력되지 않음",
                    solution: "VFX 그래프 설정과 URP 렌더 설정에서 Depth Texture 및 Opaque Texture 옵션을 활성화",
                    result: "개발 및 빌드 환경 모두에서 이펙트가 동일하게 출력됨"
                }
            ],
            leadership: {
                teamwork: [
                    "Git 브랜치 전략 및 협업 워크플로우 학습",
                    "코드 리뷰 및 주간 회의를 통한 피드백 기반 개발 경험 축적"
                ],
                leadership: [
                    "프로젝트 초기 설정 및 코드 컨벤션 제시",
                    "팀원 역량 고려한 역할 분담 및 일정 조율",
                    "기술적 지원과 문제 해결을 주도하며 팀 분위기 조성"
                ]
            },
            outcomes: {
                technical: [
                    "VR 환경에서의 실질적인 개발 경험 확보",
                    "상태 관리, 데이터 저장, 셰이더 등 다양한 시스템 구현 경험",
                    "첫 팀 프로젝트를 통한 협업 프로세스 이해"
                ],
                soft: [
                    "리더십 및 협업 능력 강화",
                    "문제 해결 중심의 접근 방식 체득",
                    "효과적인 커뮤니케이션 능력 향상"
                ],
                process: [
                    "Git 기반 협업과 코드 리뷰 경험을 통해 실무에 필요한 개발 프로세스 숙지",
                    "빌드 세팅에 대한 기초 이해"
                ]
            },
            conclusion: "SpaceShipLooting VR은 저에게 처음으로 개발 팀장 역할을 맡아 본 프로젝트로, 단순히 기능 구현을 넘어서 프로젝트 구조 설계, 협업 프로세스 이해, 그리고 문제 해결 능력까지 성장할 수 있는 계기였습니다. 이를 바탕으로 Unity 기반 게임 클라이언트 개발자로서의 기본기를 다졌다고 자신합니다."
        },
        destiny: {
            title: "Destiny Savior",
            type: "판타지 3인칭 액션 RPG 게임",
            period: {
                prototype: "2025.01.06 ~ 2025.02.10",
                main: "2025.03.04 ~ 2025.04.23"
            },
            teamSize: "6명 (부 팀장 및 개발 팀장)",
            environment: {
                development: "Unity 2022.3 (URP), C#",
                build: "PC"
            },
            youtube: "oQkfw0fAKwE",
            links: [
                { url: "https://github.com/Mained606/DsProject", icon: "github", text: "GitHub" },
                { url: "https://drive.google.com/file/d/1ct5vo1cip51D-wZ6a6jS3Q4hZQguwTWb/view?usp=drive_link", icon: "google-drive", text: "빌드 다운로드" }
            ],
            tech: ["상태 패턴", "옵저버 패턴", "싱글톤 패턴"],
            overview: "Destiny Savior는 판타지 세계관의 3인칭 액션 RPG 게임입니다. 플레이어는 검과 완드를 통해 마법과 같은 스킬을 사용하여 몬스터들과 전투를 벌이고, 드래곤을 동료로 삼아 같이 성장해나가는 여정을 경험합니다. 코어 시스템 개발자로서 게임의 기반이 되는 매니저 시스템과 상태 관리, 전투 시스템 등을 구현했습니다.",
            responsibilities: [
                {
                    title: "게임 코어 시스템 설계 및 구현",
                    points: [
                        "베이스 매니저 클래스 설계로 일관된 매니저 시스템 구축",
                        "게임 상태 머신을 통한 전체 게임 흐름 제어",
                        "매니저 간 의존성 관리 및 초기화 순서 제어",
                        "이벤트 기반 시스템으로 컴포넌트 간 결합도 최소화"
                    ]
                },
                {
                    title: "전투 시스템 개발",
                    points: [
                        "캐릭터 스탯 시스템 설계 및 구현",
                        "물리/마법 데미지 계산 로직 구현",
                        "버프/디버프 시스템 개발",
                        "원소 속성 시스템 구현",
                        "전투/탐험 상태 전환 관리"
                    ]
                },
                {
                    title: "펫 및 몬스터 시스템 개발",
                    points: [
                        "펫 진화 시스템 설계 및 구현",
                        "몬스터(보스포함) 스탯 시스템 설계 및 구현",
                        "몬스터 스폰 시스템 구현",
                        "몬스터 AI 개발",
                        "펫 AI 개발"
                    ]
                },
                {
                    title: "세이브 시스템 구현",
                    points: [
                        "캐릭터, 인벤토리, 스킬, 퀘스트 데이터 저장/로드",
                        "세이브 포인트 시스템 개발",
                        "씬 전환 시 게임 상태 유지 기능 구현"
                    ]
                },
                {
                    title: "입력 시스템 및 UI 상태 관리",
                    points: [
                        "상황별 입력 제어 시스템 구현",
                        "UI 상태에 따른 게임플레이 일시정지 처리",
                        "키 바인딩 시스템 개발",
                        "UI 상태 전환 및 중첩 관리"
                    ]
                }
            ],
            challenges: [
                {
                    title: "매니저 초기화 순서 문제 및 씬 전환 구조 설계",
                    problem: "메인 씬에서 대부분의 기능을 구현한 뒤 타이틀 씬을 추가하였는데, 매니저 시스템들이 타이틀 씬에서도 실행되면서 게임 흐름과 무관한 로직이 조기 실행되었습니다. 이로 인해 특정 매니저들이 아직 초기화되지 않은 상태에서 접근을 시도하여 NullReferenceException 등의 오류가 빈번히 발생했습니다.",
                    solution: "게임 전반의 흐름을 제어하는 게임 상태 머신(GameStateMachine)을 활용하여, 씬에 따라 필요한 매니저 기능만 동작하도록 구조를 분리했습니다. 베이스 매니저 클래스 설계와 게임 매니저의 RegisterManager 구조를 통해 매니저 초기화 순서를 통제하고, 매니저 간 의존성을 명확히 정의했습니다. 각 매니저는 게임 상태 변화에 반응하도록 이벤트 기반으로 동작하게 만들어, 씬 전환에 따른 로직 충돌을 방지했습니다.",
                    result: "타이틀/로딩/메인 씬 등 각 씬의 역할에 따라 매니저 동작이 분리되어 안정적인 초기화 흐름을 확보하였고, Null 오류와 불필요한 로직 실행 문제를 해결하여 전반적인 시스템 안정성을 높일 수 있었습니다."
                },
                {
                    title: "몬스터 AI 이동 오류 (Terrain 적용 문제)",
                    problem: "몬스터를 AI를 통해 스폰하여 이동시키는 기능을 구현했을 때, 기본 바닥(Plane)에서는 정상적으로 이동하였으나, 실제 게임 맵에서 Terrain을 사용하자 지형 높이 정보가 반영되지 않아 몬스터가 공중에 떠 있거나 땅속에 파묻히는 문제가 발생했습니다.",
                    solution: "Terrain.SampleHeight() 및 레이캐스트를 활용하여 이동 목표 지점의 정확한 지형 높이를 계산하고, 몬스터의 Y축 좌표를 실시간으로 보정했습니다. 스폰 시점뿐 아니라 이동 중에도 지형 정보를 지속적으로 확인하도록 로직을 구성하고, 지형 밖의 비정상 영역 진입을 방지하기 위한 검증 로직을 추가했습니다. 착지 상태(grounded)를 수시로 체크하여 공중 부양이나 지형 하강 현상을 실시간으로 차단했습니다.",
                    result: "몬스터가 지형의 높낮이에 따라 자연스럽게 이동하게 되었으며, 스폰 위치와 경로 상에서도 Terrain과의 충돌 오류가 해결되었습니다. 유효하지 않은 지형으로의 이동이 제한되면서 게임 전반의 물리 및 AI 안정성이 향상되었습니다."
                },
                {
                    title: "게임 상태 전환 시 데이터 동기화 문제",
                    problem: "UI 상태 전환 시 게임플레이 상태와 데이터 동기화가 불일치하여 오작동 발생",
                    solution: "게임 상태 머신 도입으로 상태 전환을 통합적으로 관리하고, 타이머 매니저를 통한 일시정지 시스템 구현 (UI 활성화시 상태 전환을 통해 모든 로직 일시정지), 이벤트 시스템을 활용해 상태 변경 알림을 각 매니저에 전달",
                    result: "UI/게임 상태 간 데이터 동기화가 안정적으로 이루어져 시스템 신뢰성과 UX가 개선됨"
                },
                {
                    title: "GitHub 리포지토리 마이그레이션 및 LFS 정리",
                    problem: "팀 프로젝트 종료 후, 전체 히스토리를 포함해 개인 리포지토리로 복제하려 했으나, 대용량 파일과 누적된 히스토리로 인해 GitHub 푸시 오류 및 LFS 관련 문제가 발생했습니다.",
                    solution: "git lfs migrate 명령어를 활용해 .unity, .asset 등 대용량 파일을 LFS로 이관하고, 기존 히스토리를 정리하여 전체 용량을 최적화했습니다. 일부 누락된 리소스는 설정 조정을 통해 부분 푸시로 대처했습니다.",
                    result: "리포지토리를 안정적으로 정리하여 GitHub 푸시와 클론이 원활해졌으며, 대용량 프로젝트 관리 및 Git LFS 운영에 대한 실전 경험을 확보했습니다."
                }
            ],
            outcomes: {
                technical: [
                    "디자인 패턴을 활용한 확장 가능한 시스템 설계 경험",
                    "이벤트 기반 프로그래밍의 실전 적용",
                    "대규모 프로젝트의 데이터 관리 및 직렬화 경험"
                ],
                soft: [
                    "코어 시스템 문서화를 통한 팀 생산성 향상",
                    "재사용 가능한 컴포넌트 설계로 개발 효율성 증대",
                    "코드 리뷰를 통한 품질 관리 프로세스 정립"
                ],
                process: [
                    "시스템 의존성 분석 및 관리 능력 향상",
                    "장기 프로젝트의 버전 관리 및 유지보수 경험"
                ]
            },
            conclusion: "이 프로젝트를 통해 게임 시스템 설계의 중요성과 확장 가능한 아키텍처의 가치를 깊이 이해하게 되었습니다. 특히 이벤트 기반 시스템과 상태 패턴의 활용이 대규모 프로젝트에서 얼마나 효과적인지 실감할 수 있었습니다. 이러한 경험은 앞으로의 게임 개발 프로젝트에서 큰 자산이 될 것이라 생각됩니다."
        },
        binglerun: {
            title: "빙글런 펫즈",
            type: "하이브리드 러닝 게임",
            period: "2025.05.01 ~ 진행중",
            teamSize: "4명 (팀장)",
            environment: {
                development: "Unity 6 2D, C#",
                build: "Android APK"
            },
            youtube: "",
            links: [
                { url: "https://github.com/JWS-SOFT/Bingglerun-Pets", icon: "github", text: "GitHub" }
            ],
            tech: ["상태 패턴", "FireBase Consol (Realtime DB, Auth)"],
            overview: "빙글런 펫즈는 무한의 계단과 쿠키런의 게임플레이 메커니즘을 결합한 독특한 러닝 게임입니다. 플레이어는 나선형 계단을 따라 상승하며 장애물을 피하고 아이템을 수집하며, 다양한 펫과 함께 끝없는 모험을 즐길 수 있습니다. 수직적 이동과 수평적 러닝의 조화로운 결합을 통해 새로운 게임플레이 경험을 제공합니다.",
            responsibilities: [
                {
                    title: "Firebase 인증 시스템 구현",
                    points: [
                        "이메일/비밀번호 회원가입 및 로그인 시스템 개발",
                        "게스트 로그인 기능 구현",
                        "구글 로그인 연동 시스템 구축",
                        "계정 삭제 및 데이터 관리 기능 개발"
                    ]
                },
                {
                    title: "실시간 데이터베이스 구현",
                    points: [
                        "Firebase Realtime Database 연동 및 구조 설계",
                        "플레이어 데이터 저장 및 동기화 시스템 개발",
                        "리더보드 시스템 구현",
                        "친구 추가 및 요청, 친구목록 같은 친구 시스템 구현",
                        "스테이지 정보를 불러와 스테이지 셀렉트 씬에 연동",
                        "데이터 백업 및 복구 기능 구현"
                    ]
                },
                {
                    title: "계정 관리 시스템 개발",
                    points: [
                        "자동 로그인 및 세션 관리 기능 구현",
                        "계정 상태 모니터링 및 에러 처리",
                        "사용자 프로필 관리 시스템 개발",
                        "보안 및 데이터 검증 로직 구현"
                    ]
                },
                {
                    title: "씬 전환 시스템 구현",
                    points: [
                        "타이틀씬 → 로비 → 스테이지 셀렉트 → 인게임 → 로비 연결",
                        "각 연결 과정에서 상태 전환 시스템을 사용하여 매니저 시스템 컨트롤"
                    ]
                }
            ],
            challenges: [
                {
                    title: "Firebase 데이터 동기화 문제",
                    problem: "처음 도입해본 DB 기능으로 인해 관리자가 DB에서 계정 삭제시 인게임 오류 발생",
                    solution: "ReloadAsync()를 통한 토큰 갱신 시스템 구현, 사용자 정보 갱신 후 계정 유효성 검증 로직 추가, 계정 삭제 시 DB 데이터도 함께 정리하는 로직 구현",
                    result: "관리자의 DB 조작에도 안정적인 게임 플레이 가능, 데이터 정합성 확보"
                },
                {
                    title: "Firebase SDK 설정 문제",
                    problem: "처음 사용하는 Firebase SDK의 복잡한 설정으로 인한 빌드 오류",
                    solution: "Player Settings에 FIREBASE_AUTH, FIREBASE_DATABASE 등의 컴파일 심볼 추가, FirebaseDefineSymbols 클래스를 통한 자동화된 SDK 설정 시스템 구현, 플랫폼별 Firebase 플러그인 설정 최적화",
                    result: "안정적인 Firebase 기능 사용 및 크로스 플랫폼 빌드 가능"
                }
            ],
            leadership: {
                teamwork: [
                    "Firebase 서비스의 실제 구현 경험 획득",
                    "실시간 데이터베이스 설계 및 능력 향상",
                    "보안 및 인증 시스템 구현 노하우 습득"
                ],
                leadership: [
                    "체계적인 데이터베이스 구조 설계 능력 향상",
                    "사용자 데이터 관리 및 보안 관련 지식 습득",
                    "클라우드 서비스 활용 능력 강화"
                ]
            },
            outcomes: {
                technical: [
                    "Firebase 인증 및 데이터베이스 시스템 성공적 구현",
                    "안정적인 실시간 데이터 동기화 시스템 구축",
                    "효율적인 상태 관리 시스템 설계"
                ],
                soft: [
                    "체계적인 프로젝트 관리 경험",
                    "효율적인 팀 커뮤니케이션 체계 구축",
                    "Git을 통한 버전 관리 경험"
                ],
                process: [
                    "Firebase 서비스 활용 능력 향상",
                    "실시간 데이터베이스 구조 설계 경험",
                    "보안 및 인증 시스템 구현 노하우 습득"
                ]
            },
            conclusion: "빙글런 펫즈 프로젝트를 통해 Firebase를 활용한 백엔드 시스템 구현과 실시간 데이터베이스 관리 경험을 쌓았습니다. 특히 사용자 인증과 데이터 동기화와 같은 핵심적인 기능을 성공적으로 구현하며, 모바일 게임 개발에서 중요한 백엔드 통합 능력을 키웠습니다."
        }
    };

    // 모달 관련 요소
    const modal = document.querySelector('.project-modal');
    const modalContent = modal.querySelector('.modal-content');
    const modalBody = modal.querySelector('.modal-body');
    const closeModal = modal.querySelector('.close-modal');

    console.log('Modal elements:', { modal, modalContent, modalBody, closeModal });

    // 모달 열기 함수
    function openModal(projectId) {
        console.log('Opening modal for project:', projectId);
        const project = projectData[projectId];
        if (!project) {
            console.error('Project not found:', projectId);
            return;
        }

        // 모달 내용 설정 전에 스크롤 위치 초기화
        modalBody.scrollTop = 0;
        modalContent.scrollTop = 0;
        modal.scrollTop = 0;

        modalBody.innerHTML = `
            <div class="project-header">
                <h3>${project.title}</h3>
                <p class="project-type">${project.type}</p>
            </div>

            <div class="project-info">
                <div class="info-group">
                    <h4>팀 프로젝트 개요</h4>
                    <ul class="info-list">
                        <li><strong>개발 기간:</strong> ${
                            project.period.prototype ? 
                            `1차 프로토타입: ${project.period.prototype}<br>
                             2차 본 프로젝트: ${project.period.main}` :
                            project.period
                        }</li>
                        <li><strong>개발 인원:</strong> ${project.teamSize || '정보 없음'}</li>
                        <li><strong>개발 환경:</strong> ${project.environment ? project.environment.development : '정보 없음'}</li>
                        <li><strong>빌드 환경:</strong> ${project.environment ? project.environment.build : '정보 없음'}</li>
                    </ul>
                </div>
            </div>

            ${project.youtube ? `
            <div class="video-container mb-4">
                <iframe
                    src="https://www.youtube.com/embed/${project.youtube}"
                    title="${project.title} 시연 영상"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
            ` : ''}

            <div class="project-links mb-4">
                ${project.links.map(link => `
                    <a href="${link.url}" target="_blank" class="btn btn-outline-primary">
                        <i class="fab fa-${link.icon}"></i> ${link.text}
                    </a>
                `).join('')}
            </div>

            <div class="tech-stack mb-4">
                <h4>기술 스택</h4>
                <div class="tech-tags">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>

            <div class="project-overview mb-4">
                <h4 class="section-title">프로젝트 요약</h4>
                <p>${project.overview}</p>
            </div>

            <div class="responsibilities mb-4">
                <h4 class="section-title">주요 담당 업무</h4>
                ${project.responsibilities.map(resp => `
                    <div class="responsibility-group">
                        <h5>${resp.title}</h5>
                        <ul>
                            ${resp.points.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>

            <div class="challenges mb-4">
                <h4 class="section-title">문제 해결 경험</h4>
                ${project.challenges.map(challenge => `
                    <div class="challenge-card">
                        <h5>${challenge.title}</h5>
                        <p><strong>문제:</strong> ${challenge.problem}</p>
                        <p><strong>해결:</strong> ${challenge.solution}</p>
                        <p><strong>결과:</strong> ${challenge.result}</p>
                    </div>
                `).join('')}
            </div>

            <div class="outcomes-section mb-4">
                <h4 class="section-title">성과 및 배운 점</h4>
                <div class="outcomes-group">
                    <h5>기술적 성장</h5>
                    <ul>
                        ${project.outcomes.technical.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <h5>소프트 스킬 향상</h5>
                    <ul>
                        ${project.outcomes.soft.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <h5>개발 프로세스 이해</h5>
                    <ul>
                        ${project.outcomes.process.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="conclusion">
                <p>${project.conclusion}</p>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    // 모달 닫기 함수
    function closeModalHandler() {
        modal.classList.remove('active');
        
        // 모달 닫을 때 스크롤 초기화
        modalBody.scrollTop = 0;
        modalContent.scrollTop = 0;
        modal.scrollTop = 0;
        
        // 유튜브 영상 중지
        const youtubeIframe = modal.querySelector('iframe[src*="youtube"]');
        if (youtubeIframe) {
            youtubeIframe.src = youtubeIframe.src;
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            
            // 모달이 완전히 닫힌 후에도 스크롤 초기화
            modalBody.scrollTop = 0;
            modalContent.scrollTop = 0;
            modal.scrollTop = 0;
        }, 300);
    }

    // 포트폴리오 아이템 클릭 이벤트
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.getAttribute('data-project');
            console.log('Portfolio item clicked:', projectId);
            
            // 모달 열기 전 스크롤 초기화
            modalBody.scrollTop = 0;
            modalContent.scrollTop = 0;
            modal.scrollTop = 0;
            
            openModal(projectId);
        });
    });

    // 자세히 보기 버튼 클릭 이벤트
    document.querySelectorAll('.view-project').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = e.target.closest('.portfolio-item').dataset.project;
            const modal = document.querySelector('.project-modal');
            const modalContent = modal.querySelector('.modal-content');
            
            // 모달 열기 전 스크롤 초기화
            modal.scrollTop = 0;
            modalContent.scrollTop = 0;
            
            // 모달 내용 설정
            modalContent.innerHTML = getProjectContent(projectId);
            
            // 모달 표시
            modal.style.display = 'block';
            
            // 모달 닫기 이벤트 설정
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.style.display = 'none';
                // 모달 닫을 때 스크롤 초기화
                modal.scrollTop = 0;
                modalContent.scrollTop = 0;
            });
        });
    });

    // 모달 닫기 버튼 이벤트
    closeModal.addEventListener('click', closeModalHandler);

    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalHandler();
        }
    });

    // 자기소개서 데이터
    const coverLetterData = {
        sections: [
            {
                title: "1. 지원 동기",
                content: `어릴 적부터 게임은 제 삶의 중심이었습니다. 특히 RPG 장르에 깊은 애정을 갖고, 로스트아크, 리니지 이터널(CBT), 디지몬 RPG 등에서 랭킹 상위권을 달성하며 게임 메커니즘을 분석하고 경쟁의 즐거움을 체험해왔습니다. 단순한 플레이를 넘어서 "이 데미지 공식은 어떻게 구성될까?", "버그는 어떤 조건에서 발생할까?"와 같은 기술적 호기심을 꾸준히 가져왔으며, 실제로 신규 아이템의 데미지 오류를 제보하고 공식 구조를 분석한 경험도 있습니다. 학생일 당시 게임을 즐기며 C의 기초 문법에 대해 궁금증이 생기게 되었고 콘솔 프로그램을 이용하여 데미지 적용 계산기와 같은 툴 비슷한 프로그램을 만들어 본 경험이 있습니다. 이러한 경험은 시스템 설계와 디버깅 역량의 기반이 되었습니다.

게임을 단순한 소비가 아닌 창조의 대상으로 바라보게 되며 자라왔고, 이후 커리어 전환을 결정하게 되었을 때 게임 개발자로서 성장하고자 마음먹었고, 게임 개발 철학과 기술 중심의 프로젝트 운영 방식에 큰 매력을 느껴 지원하게 되었습니다.`
            },
            {
                title: "2. 전공 및 커리어 전환 배경",
                content: `중학생 시절부터 음악을 전공하며 일렉기타 연주에 모든 열정을 쏟아부었습니다. 밴드부 리더로서 팀을 이끌며 협업과 일정 조율 능력을 키웠고, 공연을 준비하는 과정은 제게 큰 보람이자 삶의 중심이었습니다. 하지만 손 부상으로 인해 정교한 연주가 어려워진 이후, 코로나 시기까지 겹치게 되어 마치 모든 것을 잃은 듯한 상실감을 겪었습니다.

그 시기에도 저는 꾸준히 온라인 게임과 콘솔 게임을 즐기고 있었고, "이 게임은 어떻게 만들었을까?", "이 시스템을 만든 사람은 정말 천재 같다"는 감탄과 동경을 자주 느꼈습니다. 연주를 포기해야 했던 절망 속에서 유일하게 저를 위로해준 것도 결국 게임이었습니다. 게임은 단순한 오락을 넘어, 제게 다시 꿈을 꾸게 하고 삶의 의지를 되찾게 해준 존재였습니다.

그때 결심했습니다. 나도 누군가에게 위로와 희망을 줄 수 있는 게임을 만들자고. 그렇게 게임 클라이언트 개발자로의 전향을 결심했고, 이를 실현하기 위해 MBC 아카데미 부트캠프에 참여하여 체계적인 커리큘럼을 통해 Unity 개발 역량을 빠르게 축적해나갔습니다.`
            },
            {
                title: "3. 프로젝트 경험 및 주요 역량",
                content: `부트캠프에서는 VR FPS와 PC RPG 팀 프로젝트를 통해 클라이언트 개발의 전반을 경험했습니다. 팀장 및 부 팀장으로서 상태 시스템이나 전투와 관련된 시스템들 개발하며 팀원들의 작업에 있어서 막히는 부분을 도와주고 버그 상황에서 해결 방안을 제시하고 함께 해결하려 노력했습니다.

GitHub, Notion, Discord 기반의 협업 툴을 활용하며 코드 품질 관리와 실시간 커뮤니케이션을 수행했습니다. 특히 Notion을 활용한 업무 일지 및 회의록 기록을 통해 실무 중심의 문서화 역량도 함께 강화했습니다.

또한, 수료 직후에는 동료의 창업 프로젝트에 합류하여 약 한 달간 하이브리드 캐주얼 게임을 리딩하며 Firebase 연동을 통한 로그인, 랭킹, 친구 기능을 구현했습니다. 데이터 설계 경험도 함께 쌓았고, 실무 환경에 적응하여 전반을 리딩한 소중한 경험이 되었습니다. 비록 정식 고용 구조 문제로 프로젝트는 종료되었지만, 스타트업 환경에서의 실전 경험은 큰 자산이 되었습니다.`
            },
            {
                title: "4. 협업 및 문제 해결 역량",
                content: `프로젝트 진행 중 반복되는 버그나 예외 상황에 대해 원인을 분석하고, 수치를 검증하며 개발 품질을 높이는 역할을 주도적으로 수행했습니다. 단순 구현을 넘어서 시스템적 사고와 문제 해결 능력을 키웠으며, 팀 내 커뮤니케이션을 통한 문제 공유와 해결 방식에도 적극 참여했습니다. 이러한 경험은 실무에서도 빠르게 적응하고 팀에 기여할 수 있다는 자신감으로 이어졌습니다.`
            },
            {
                title: "5. 포부",
                content: `저는 유저의 시선에서 게임을 바라보며, 시스템적 관점에서 개선 방향을 제시할 수 있는 개발자입니다. 게임의 완성도를 높이고 유저에게 긍정적인 경험을 전달하는 데 실질적으로 기여하고자 합니다. 팀과 함께 성장하고, Unity 클라이언트 개발자로서 귀사에 가치 있는 구성원이 되겠습니다.`
            }
        ]
    };

    // 자기소개서 모달 열기 함수
    function openCoverLetterModal() {
        const modal = document.querySelector('.project-modal');
        const modalBody = modal.querySelector('.modal-body');
        
        // 모달 내용 설정 전에 스크롤 위치 초기화
        modalBody.scrollTop = 0;
        modal.querySelector('.modal-content').scrollTop = 0;
        
        modalBody.innerHTML = `
            <div class="project-header">
                <h3>자기소개서</h3>
            </div>
            
            <div class="cover-letter-content">
                ${coverLetterData.sections.map(section => `
                    <div class="cover-letter-section">
                        <h4>${section.title}</h4>
                        <p>${section.content}</p>
                    </div>
                `).join('')}
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    // 자기소개서 버튼 이벤트 리스너 추가
    const coverLetterBtn = document.querySelector('.cover-letter-btn');
    if (coverLetterBtn) {
        coverLetterBtn.addEventListener('click', openCoverLetterModal);
    }

    // 이력서 모달 기능
    const resumeModal = document.querySelector('.resume-modal');
    const resumeBtn = document.querySelector('.resume-btn');
    const resumeCloseBtn = resumeModal.querySelector('.close-modal');

    resumeBtn.addEventListener('click', () => {
        resumeModal.style.display = 'block';
        resumeModal.querySelector('.modal-content').style.opacity = '1';
        resumeModal.querySelector('.modal-content').style.transform = 'translateY(0)';
        document.body.style.overflow = 'hidden';
    });

    function closeResumeModal() {
        resumeModal.querySelector('.modal-content').style.opacity = '0';
        resumeModal.querySelector('.modal-content').style.transform = 'translateY(20px)';
        
        // 유튜브 영상 중지
        const youtubeIframe = resumeModal.querySelector('iframe[src*="youtube"]');
        if (youtubeIframe) {
            youtubeIframe.src = youtubeIframe.src;
        }
        
        setTimeout(() => {
            resumeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    resumeCloseBtn.addEventListener('click', closeResumeModal);

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === resumeModal) {
            closeResumeModal();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal.style.display === 'block') {
            closeResumeModal();
        }
    });

    // 타이핑 애니메이션 초기화
    const typewriterElements = document.querySelectorAll('.typewriter');
    console.log('Typewriter elements:', typewriterElements);

    typewriterElements.forEach(element => {
        if (element) {
            const texts = element.getAttribute('data-text');
            console.log('Element texts:', texts);
            // 타이핑 속도 설정
            const speed = 100;
            const deleteSpeed = 50;
            new TypeWriter(element, texts, speed, deleteSpeed);
        }
    });

    // 스크롤 프로그레스 바
    const scrollProgress = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    });

    // 배경 별 애니메이션 생성
    function createStars() {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars';
        document.body.appendChild(starsContainer);

        const numberOfStars = 50;
        
        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // 랜덤 위치 설정
            star.style.left = `${Math.random() * 100}%`;
            
            // 랜덤 크기 설정 (1-3px)
            const size = 1 + Math.random() * 2;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // 랜덤 애니메이션 지속 시간 설정 (5-15초)
            const duration = 5 + Math.random() * 10;
            star.style.animation = `fall ${duration}s linear infinite`;
            
            // 랜덤 시작 딜레이 설정
            star.style.animationDelay = `${Math.random() * 15}s`;
            
            starsContainer.appendChild(star);
        }
    }

    // 페이지 로드 시 별 생성
    createStars();

    // 배경 파티클 애니메이션 생성
    function createParticles() {
        const container = document.createElement('div');
        container.className = 'particles-container';
        document.body.appendChild(container);

        const numberOfParticles = 8; // 파티클 개수 감소
        
        for (let i = 0; i < numberOfParticles; i++) {
            createParticle(container);
        }

        // 주기적으로 새 파티클 생성
        setInterval(() => {
            if (container.children.length < 12) { // 최대 개수 제한
                createParticle(container);
            }
        }, 4000); // 생성 간격 증가
    }

    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 랜덤 크기 (120-250px)
        const size = 120 + Math.random() * 130;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // 랜덤 시작 위치
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // 랜덤 이동 거리 (300-500px)
        const translateX = 300 + Math.random() * 200;
        const translateY = 300 + Math.random() * 200;
        const scale = 0.8 + Math.random() * 0.4;
        
        // 랜덤 애니메이션 지속 시간 (20-30초)
        const duration = 20 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        particle.style.setProperty('--translate-x', `${translateX}px`);
        particle.style.setProperty('--translate-y', `${translateY}px`);
        particle.style.setProperty('--scale', scale);
        particle.style.setProperty('--duration', `${duration}s`);
        particle.style.setProperty('--delay', `${delay}s`);
        
        container.appendChild(particle);
        
        // 애니메이션 종료 후 파티클 제거
        setTimeout(() => {
            container.removeChild(particle);
        }, (duration + delay) * 1000);
    }

    // 페이지 로드 시 파티클 생성 시작
    createParticles();
}); 